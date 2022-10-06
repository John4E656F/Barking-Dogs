import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"
import path  from "path"
import sharp  from 'sharp'
import fs  from "fs"
import { v4 }  from 'uuid'
import bcrypt from "bcrypt";

import User from "../schemas/user.js"
import Post from "../schemas/post.js"

function uid() {
    return new Date(Date.now()).getTime() + Math.floor(Math.random() * (99 + 10) + 10)
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).send("Bad field")  
        
        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(400).json({
                error: true,
                message: "User not registered!"
            });
        }
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const tokenCreated = jwt.sign({ id: user.id, username: user.username, password: user.password }, process.env.secretKey, { expiresIn: '24h' });
            return res.send({
                username: user.username,
                id: user.id,
                photo: user.photo,
                banner: user.banner,
                description: user.description,
                followers: user.followers,
                following: user.following,
                token: tokenCreated
            })
        } else {
            res.status(400).json({
              error: true,
              success: false,
              message: "Incorrect password. Please try again",
            });
            return;
          }
    } catch (err) {
        res.status(400).json({
          error: true,
          success: false,
          message: "Something went wrong " + err,
        });
    }
}

// Create Account
export const register = async (req, res) => {
    const { username, password, email, photo  } = req.body
    if (!username || !password || !email ) return res.status(400).send("Bad field")
    const user = await User.findOne({ email: email });

    const createUID = uid()

    if (user) {
        return res.status(400).json({
            error: true,
            message: "Email already exists",
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        id: createUID,
        username: username,
        password: hashedPassword,
        email: email,
        date: Date.now().toString(),
        description: '',
        photo: photo,
        banner: null,
        followers: [],
        following: []
    })
    await newUser.save();
    const createdUser = await User.findOne({ id: createUID })
    if (!createdUser) return res.status(500).send("Username taken")

    const tokenCreated = jwt.sign({ id: createUID, username: username, email: email, password: password }, process.env.secretKey, { expiresIn: '24h' });

    res.send({
        username,
        email,
        id: createUID,
        description: '',
        photo: photo,
        banner: "",
        followers: [],
        following: [],
        token: tokenCreated
    })
}

// Login with token
export const logintoken = async (req, res) => {
    const { token } = req.body

    const decodedCode = jwt.verify(token, process.env.secretKey)
    if (!decodedCode) return res.status(401).send("Unauthorized access")

    const user = await User.findOne({ id: decodedCode.id })
    if (!user) return res.status(404).send("User not found");

    res.send({
        username: user.username,
        id: user.id,
        photo: user.photo,
        banner: user.banner,
        description: user.description,
        followers: user.followers,
        following: user.following,
        token: token
    })
}

// Get all posts
export const getHome = async (req, res) => {
    const posts = await Post.find({})
    res.send(posts.reverse())
}

// Get user information with optional query
export const getUser = async (req, res) => {
    try {
        const { id } = req.query
        if (!id ) return res.status(406).send("Misuse")     
        // var search = id ? { id } : { username }      
        const user = await User.findOne({_id: id})
        if (!user) return res.status(404).send("Not found.")        
        res.send({
            username: user.username,
            photo: user.photo,
            banner: user.banner,
            id: user.id,
            description: user.description,
            followers: user.followers,
            following: user.following
        })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: "error", msg: error.message });
    }
    
}

// Get user information with optional query
export const getUserbyName = async (req, res) => {
    try {
        const { username } = req.query
        if (!username ) return res.status(406).send("Misuse")     
        // var search = id ? { id } : { username }      
        const user = await User.findOne({username: username})
        if (!user) return res.status(404).send("Not found.")        
        res.send({
            username: user.username,
            photo: user.photo,
            banner: user.banner,
            id: user.id,
            description: user.description,
            followers: user.followers,
            following: user.following
        })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: "error", msg: error.message });
    }
    
}

// Get specific posts
export const getUserPosts = async (req, res) => {
    try {
        const { user } = req.query      
        if (!user) return res.status(406).send("Misuse")
        const posts = await Post.find({ user: user })       
        res.send(posts.reverse())
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: "error", msg: error.message });
    }
}

// Create a post
export const createPost = async (req, res) => {
    const { user, date, content } = req.body

    if (!user || !content) return res.status(500).send("Err")
    if (content.length < 3) return res.status(500).send("Err")

    const post = new Post({
        user,
        date,
        content,
        likes: '0'
    })
    await post.save()

    res.sendStatus(200)
}

// Update personal information
export const updateUser = async (req, res) => {
    const { id, description, name } = req.body
    if (!id || description?.length < 3 || name?.length < 3) return res.status(500).send("Err")

    const user = await User.findOne({ id })
    if (!user) return res.status(500).send("Err")

    user.description = description
    user.username = username

    await user.save()

    res.send({
        description,
        username
    })
}

// Follow and Unfollow Route
export const followManager = async (req, res) => {
    const { followToId, id } = req.body

    const user = await User.findOne({ id })
    if (!user) return res.status(500).status("Err")

    const followTo = await User.findOne({ id: followToId })
    if (!followTo) return res.status(500).status("Err")

    if (user.following.includes(followTo.id)) user.following = user.following.filter(id => id !== followTo.id)
    else user.following.push(followTo.id);

    if (followTo.followers.includes(user.id)) followTo.followers = followTo.followers.filter(id => id !== user.id)
    else followTo.followers.push(user.id);


    await user.save()
    await followTo.save()

    res.send({
        followToUser: {
            following: followTo.following,
            followers: followTo.followers
        },
        user: {
            following: user.following,
            followers: user.followers
        }
    })
}

// Upload personal images
export const uploadImages = async (req, res) => {
    var sendForData = {
        banner: null,
        photo: null
    }

    const user = await User.findOne({ id: req.files[0].originalname.split("-")[1] })
    if (!user) return res.status(500).send("err")


    for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        let data = file.originalname.split("-")
        // data[0] = type (banner / profile)
        // data[1] = user id

        try {
            let isHasPhoto = user[data[0]]?.split('/').pop()
            // in database data => http://localhost:3030/xxx.webp, we split from '/' and select last item with pop() so we obtained img name.
            // transaction result => xxx.webp

            if (isHasPhoto) fs.unlinkSync(path.resolve() + `\\images\\${isHasPhoto}`);
            // output => 'C:\\Users\\xxx\\xxx\\twitter-api\\xxx.webp' 
        } catch (error) {
            console.log("Old photo could not be deleted")
        }

        const newName = `${v4()}.webp`
        const sizes = {
            width: data[0] == 'banner' ? 600 : 300,
            height: 300
        }
        await sharp(file.buffer).resize(sizes).toFile(`./images/${newName}`);

        const imgPath = `http://localhost:3030/images/${newName}`
        user[data[0]] = imgPath
        sendForData[data[0]] = imgPath
        if (i == req.files.length - 1) send()
    }


    function send() {
        user.save()
        res.send(sendForData)
    }
}