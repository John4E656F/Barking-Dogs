const Bark = require("../models/Bark");
const Like = require("../models/Like");
const Commnet = require("../models/Comment");
const Rebark = require("../models/Rebark");
const { cloudinaryLink } = require("../utils/upload");

//Get ALL Barks
exports.getAllBarks = async (req, res) => {
    try {
        const barks = await Bark.find();
        res.status(200).json({
            status : "success",
            data: {
                barks
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Bark
exports.getBark = async (req ,res) => {
    try {
        const bark = await Bark.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                bark
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Create Bark
exports.createBark = async (req, res) => {
    try {
        const user = req.user;
        //Get Cloudinary Link for Media
        // const mediaLink = await cloudinaryLink(req.file.path);
        let bark = await Bark.create({
            userId: user._id,
            text: req.body.text,
            media: mediaLink.url
        });
        bark = await bark.populate("userId", "name username").excecPopulate();

        res.status(201).json({
            status: "success",
            data: {
                bark
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Barks Of User
exports.getBarksOfUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const barks = await Bark.find({ userId })
            .populate("userId", "name username")
            .sort("-createdAt");
        res.status(200).json({
            status: "success",
            data: {
                length: barks.length,
                barks
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Update My Bark
exports.updateMyBark = async (req, res) => {
    try {
        const bark = await Bark.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            {
                new: true
            }
        );
        res.status(200).json({
            status: "success",
            data: {
                bark
            }
        });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({ status: "error", msg: err.message})
    }
};

//Delete My Bark
exports.deleteMyBark = async (req, res) => {
    try {
        const barkId = req.params.id;
        await Bark.findOneAndDelete({ _id: barkId, userId: req.user.id });
        await Like.deleteMany({ barkId });
        await Comment.deleteMany({ barkId });
        await Rebark.deleteMany({ barkId });
        res
            .status(204)
            .json({ status: "success", msg: "Bark successfully deleted" });
    }   catch (err) {
        console.log(err.message);
        res.status(400).json({ status: "error", msg: err.message})
    }
};