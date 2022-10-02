const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    //Follower
    followed: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    //Follower
    following: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }
});

const Connection = mongoose.model("Connection", connectionSchema);
module.exports = Connection;