const Bookmark = require("../models/Bookmark");

exports.addBookmark = async (req, res) => {
    try {
        const userId = req.user.id,
        barkId = req.params.id;

        if (await Bookmark.exist({ barkId, userId })) {
            return res.status(400).json({
                status: "fail",
                msg: "You have already bookmarked this bark"
            });
        }

        const bookmark = await Bookmark.create({
            barkId,
            userId
        });

        res.status(200).json({
            status: "success",
            data: {
                bookmark
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

exports.removeBookmark = async (req, res) => {
    try {
        const userID = req.user.id,
            barkId = req.params.id;
        const bookmark = await Bookmark.findOneAndDelete({
            barkId,
            userID
        });

        res.status(204).json({
            status: "success",
            msg: "Successfully removed bookmark",
            data: {
                bookmark
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

exports.getAllBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookmarks = await Bookmark.find({ userId });

        res.status(200).json({
            status: "success",
            data: {
                bookmarks
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};

exports.clearAllBookrmarks = async (req, res) => {
    try {
        const userId = req.user.id;
        await Bookmark.deleteMany({ userId });

        res.status(2304).json({
            status: "success",
            msg: "Successfully cleared all bookmarks"
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            msg: err.message
        });
    }
};