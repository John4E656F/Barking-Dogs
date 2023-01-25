import express from 'express'
import auth  from '../middleware/authorization.js'
import multer  from "multer"

import { 
    createPost,
    follow,
    unfollow,
    getHome,
    getUser,
    getUserbyName,
    getUserPosts,
    login, 
    logintoken, 
    register,
    updateUser,
    uploadImages
} from '../controllers/user.controller.js'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router()

router.get("/", (req, res) => res.send("just dev."))

router.get("/home", getHome)

router.get("/user", getUser)

router.get("/username", getUserbyName)

router.get("/userPosts", getUserPosts)

router.post("/register", register)

router.post("/login", login)

router.post("/auth", logintoken)

router.post("/post",  createPost)

router.post("/upload", auth, upload.array('files'), uploadImages)

router.post("/update", auth, updateUser)

router.post("/follow", auth, follow)

// router.post("/unfollow", auth unfollow)

export default router