const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
     {
        text: {
            text: String,
            required: [true, "Notification should contain some text"]
        },
        receiver: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Notification should have a receiver"]
        },
        seen: Boolean
     },
     { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;