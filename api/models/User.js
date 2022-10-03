const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); //The crypto module provides a way of handling encrypted data.

const userSchema  = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        bio: {
            type: String,                   
            maxLength: 160
        },
        location: {
            type: String,
            maxLength: 30
        },
        profilePicture: String,
        coverPicture: String,
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 8,
            select: false
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    {
        timestamps: true,
    }
);


//Create Reset Password Token
userSchema.methods.createPasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Data.now() + 10 * 60 * 1000;
    return resetToken;
};

//Check If Password Changed
userSchema.methods.changedPasswordAfter = (JWTTimeStamp) => {
    if (this.passwordChangedAt) {
        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;