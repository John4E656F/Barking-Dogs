const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
// const router = require("./messageRoute");

router.get("/", authController.protect, authController.getUserFromToken);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;