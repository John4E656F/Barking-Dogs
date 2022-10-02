const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        barkId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Bark",
            required: true
        },
        text: {
            type: String,
            required: [true, "Comment should contain text"],
            maxlength: 200
        },
        media: {
            type: String
        },
        likesCount: {
            type: Number,
            default: 0
        },
        commentCount: {
            type: Number,

            default : 0
        },
        rebarksCount: {
            type: Number,
            default: 0
        }
    }, 
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;