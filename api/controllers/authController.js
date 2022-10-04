const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const {
  signUpUserValidation,
  loginUserValidation
} = require("../utils/validation");

const User = require("../models/User");
const Email = require("../utils/email");
const StripQuotes = require("concurrently/src/command-parser/strip-quotes");

const signToken = id => {
  const token = jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: '360000s'
  });
  return token;
};

const validationError = (res, error) => {
  return res.status(400).json({
    status: "fail",
    msg: error.details.map(details => details.message)
  });
};

//Protecting routes from non-logged users
exports.protect = async (req, res, next) => {
  try {
    //Gettoken
    let token;
    if(
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        msg: "Please log in first"
      });
    }

    //Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);

    //Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        msg: "The user belonging to this token longer exist"
      });
    }

    //Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        msg: "The password was changed. Please log in again"
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

//Get User from token
exports.getUserFromToken = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.status(200).json({ status: "success", data: { user } });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: "fail", msg: "Server Error" });
  }
};

//Signup
exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        error: true,
        message: "Email already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    }).then((user) => {
      return res.status(200).json({
        message: "Registered Successfully",
      })
    })

    await new Email(newUser).sendWelcome();

    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        newUser
      }
    })
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

//Login
exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    
    //Confirm email and password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({
        error: true,
        message: "Sorry, we can't find an account with this email address. Please try again, later."
      });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const accessToken = signToken(user._id);
      res.status(200).json({
        status: "success",
        token: accessToken,
        data: {
          user
        }
      });
    } else {
      res.status(400).json({
        error: true,
        success: false,
        message: "Incorrect password. Please try again",
      });
      return;
    }
  } catch (err) {
  res.status(400).json({
    error: true,
    success: false,
    message: "Something went wrong " + err,
    });
  }
};

//Forget Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        msg: "fail",
        msg: "No user exists with this e-mail"
      });
    }

    //Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's e-mail
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;
    await new Email(user).sendPasswordReset(resetURL);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!"
    });
  } catch (err) {
    console.log(err);
    User.passwordResetToken = undefined;
    User.passwordResetExpires = undefined;
    await User.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "fail",
      msg: "There was an error sending the email"
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    //Get user from the reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // Token Error
    if (!user) {
      return res.status(400).json({
        status: "fail",
        msg: "Token is invalid or expired"
      });
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};
