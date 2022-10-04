const mongoose = require("mongoose");


const barkSchema= new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: [true, "Bark should be associated with a user"]
        },
        text: {
            type: String,
            required: [true, "Bark should contain text"],
            maxlength: 260
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
            default: 0
        },
        rebarksCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Bark = mongoose.model("Bark", barkSchema)
module.exports = Bark;