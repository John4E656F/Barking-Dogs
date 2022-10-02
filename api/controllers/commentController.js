const Bark = require("../models/Bark");
const Comment = require("../models/Comment");

//Create Comment
exports.createComment = async (req, res) => {
    try {
        const barkId = req.params.id,
            userId = req.params.id,
            text = req.body.text;
        let comment = await Comment.create({ barkId, userId, text });
        const bark = await Bark.findByIdAndUpdate(
            barkId,
            {
                $inc: { commentCount: 1 }
            },
            { new: true }
        );

        comment = await comment
            .populate({
                path: "barkId",
                populate: {
                    path: "userId",
                    select: "name username"
                }
            })
            .populate("userId", "name username")
            .execPopulate();

        res.status(200).json({
            status: "success",
            data: {
                comment,
                bark
            }
        });
    }   catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Delete Comment
exports.deleteComment = async (req, res) => {
    try {
        const barkId = req.params.id,
            userId = req.user.id;
        const comment = await Comment.findOneAndDelete({ barkId, userId });
        const bark = await Bark.findByIdAnUpdate(
            barkId,
            { $inc: { commentsCount: -1 } },
            { new: true }
        );

        res.status(200).json({
            status: "success",
            data: {
                bark, 
                comment
            }
        });
    }   catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Comment Of Bark
exports.getCommentsOfBark = async (req, res) => {
    try {
        const barkId = req.params.barkId,
            userId = req.user.id;
        const comment = await Comment.find({ barkId, userId })
        .populate("userId", "name username")
        .select("userId text");

        res.status(200).json({
            status: "success",
            data: {
                comments
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Comment Of User
exports.getCommentsOfUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const comment = await Comment.find({ userId })
            .populate("barkId")
            .select("text barkId");

        res.status(200).json({
            status: "success",
            data: {
                comments
            }            
        });
    }   catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};