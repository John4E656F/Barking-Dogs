const mongoose = require("mongoose");

const rebarkSchema = new mongoose.Schema(
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
    { tipmestamps: true }
);

const Rebark = mongoose.model("Rebark", rebarkSchema);
module.exports = Rebark;