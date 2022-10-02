const express = require("express").Router();

const authController = require("../controllers/authController");
const connectionController = require("../controllers/connectionController");
const router = require("./messageRoute");

//For Logged-in Users
router.use(authController.protect);

router.post("/follow/:id", connectionController.follow);
router.delete("/unfollow/:id", connectionController.unfollow);

module.exports = router;