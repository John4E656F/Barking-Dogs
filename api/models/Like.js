const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
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
        }
    }, 
    { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;