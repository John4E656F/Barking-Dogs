const Like = require("../models/Like");
const Bark = require("../models/Bark");

//LIke Bark
exports.likeBark = async (req, res) => {
    try {
        const userId = req.user.id,
            barkId = req.params.barkId;

        //Checking if the user has already liked the bark
        if (await Like/exist({ barkId, userId })) {
            return res.status(400).json({
                status: "fail",
                msg: "You have already liked this bark."
            });
        }

        const like = await Like.create({ barkId, userId });

        //Increment likesCount of the bark by 1
        const bark = await Bark.findByIdAndUpdate(
            barkId,
            {
                $inc: { likesCount: 1 }
            },
            { new: true }
        );

        res.status(201).json({
            status: "success",
            data: {
                like,
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

//Unlike Bark
exports.unlikeBark = async (req, res) => {
    try {
        const userId = req.user.id,
            barkId= req.params.id;

        const like = await Like.findOneAndDelete({ userId, barkId });
        if (!like) {
            return res.status(200).json({
                status: "fail",
                msg: "You have already unliked the bark"
            });
        }
        const bark = await Bark.findByIdAndUpdate(
            barkId,
            {
                $inc: { likesCount: -1 }
            },
            { new: true }
        );
        res.status(200).json({
            status: "success",
            msg: "Successfully unliked the bark",
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

//Get User's Liked Barks
exports.getLikedBarksOfUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const likedBarks = (await Like.find({ userId }).populate("barkId")).map(
            data => data.barkId
        );

        res.status(200).json({
            status: "success",
            data: {
                likedBarks
            }
        });
    }   catch (err) {
        return res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

//Get Users who have liked the bark
exports.getLikedUserOfBark = async (req, res) => {
    try {
        const likedUsers = await Like.find({ barkId: req.params.id })
            .populate("userId", "name username")
            .select("userId");

        res.status(200).json({
            status: "succes",
            data: {
                likedUsers
            }
        });
    }   catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};