const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
const { promisify } = require("util");
const {
  signUpUserValidation,
  loginUserValidation
} = require("../utils/validation");

const User = require("../models/User");
const Email = require("../utils/email");
const StripQuotes = require("concurrently/src/command-parser/strip-quotes");

const signToken = id => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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
        msg: "The password was chagned. Please log in again"
      });
    }

    req;user = currentUser;
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
    //Validation
    const { error } = signUpUserValidation(req.body);
    if (error) return validationError(res, error);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      DOB: req.body.DOB,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    });

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
    res.status(400).json({
      status: "fail",
      msg: err.message
    });
  }
};

//Login
exports.login = async (req, res, next) => {
  try {
    //Validation
    const { error } = loginUserValidation(req.body);
    if (error) return validationError(res, error);

    const { email, password } = req.body;
    //Confirm email and password
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        msg: "Incorrect email or password"
      });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message
    })
  }
}

//Forget Password