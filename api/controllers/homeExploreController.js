const Connection = require("../models/Connection");
const Bark = require("../models/Bark");
const Rebark = require("../models/Rebark");
const User = require("../models/User");
const Comment = require("../models/Comment");

exports.getHomeContent = async (req, res) => {
    try {
        let followings = await Connection.find({ following: req.user.id });
        let result = [];

        //Get other user's Bark and rebark
        for (let i = 0; i < followings.length; i++) {
            const barkArr = await Bark.find({
                userId: followings[i].followed
            }).populate("userId", "name username");
            const rebarkArr = await Rebark.find({
                userId: followings[i].followed
            })
                .populate({
                    path: "barklId",
                    populate: {
                        path: "userId",
                        select: "name username"
                    }
                })
                .populate("userId", "name username");
            const commentsArr = await Comment.find({
                userId: followings[i].followed
            })
                .populate("barkId")
                .populate("userId", "name username");
            result = result.concat(barkArr, rebarkArr, commentsArr);
        }
        //Get logged in user's barks and rebarks
        result = result.concat(
            await barkArr.find({ userId: req.user.id }).populate(
                "userId",
                "name username"
            )
        );
        result = result.concat(
            await Rebark.find({ userId: req.user.id })
                .populate({
                    path: "barkId",
                    populate: {
                        path: "userId",
                        select: "name username"
                    }
                })
                .populate("userId", "name username")
        );
        result = result.concat(
            await Comment.find({ userId: req.user.id })
                .poplate({
                    path: "barkId",
                    populate: {
                        path: "userId",
                        select: "name username"
                    }
                })
                .populate("userId", "name username")
        );

        //Sort all barks according to the date in descending order
        result.sort((bark1, bark2) => {
            return new Date(bark2.createdAt) - new Date(bark1.createdAt);
        });

        res.status(200).json({
            status: "success",
            data: {
                result
            }
        });
    }   catch (err) {
        res.status(200).json({
            status: "fail",
            msg: err.message
        });
    }
};

exports.getExploreContent = async (req, res) => {
    try {
        const suggestions = await this.getFollowSuggestion(req.user.id);
        res.status(200).json({
            status: "success",
            data: {
                suggestions
            }
        });
    }   catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

exports.getFollowSuggestion = async id => {
    const followings = await Connection.find({ following: id }).select(
        "followed"
    );
    let followingsArr =  Array.from(followings, following => following.followed);
    followingsArr.push(id);

    //Get User's which are not in the following of the user
    const users = await User.find({ _id: { $nin: followingsArr } });
    return users;
};