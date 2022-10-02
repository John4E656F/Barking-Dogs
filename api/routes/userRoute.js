const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const likeController = require("../controllers/likeController");
const connectionController = require("../controllers/connectionController");
const commentController = require("../controllers/commentController");
const barkController = require("../controllers/barkController");
const bookmarkController = require("../controllers/bookmarkController");
const rebarkController = require("../controllers/rebarkController");
const homeExploreController = require("../controllers/homeExploreController");

//Forgot Password
router.post("/forgotPassword",  authController.forgotPassword);
//Reset Password
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.get("/", userController.getAllUsers);
router.patch(
    "/updateMe",
    userController.uploadUserImages,
    userController.resizeUserImages,
    userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

//Related To Home ANd Explore Section
router.get("/home", homeExploreController.getHomeContent)
router.get("/explore", homeExploreController.getExploreContent);

//Related To Bark
router.get("/bark/:id", barkController.getBarksOfUser);

//Related To Like
router.get("/like/:id", likeController.getLikedBarksOfUser);

//Related To Comment
router.get("/comment/:id", commentController.getCommentsOfUser);

//Related To Connection
router.get("/followers/:id", connectionController.getFollowers);
router.get("/following/:id", connectionController.getFollowing);

//Related To Bookmark
router.get("/bookmark", bookmarkController.getAllBookmarks);
router.delete("/bookmark", bookmarkController.clearAllBookmarks);

//Related To Rebark
router.get("/rebark/:id", rebarkController.getRebarksOfUser);

router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser);

module.exports = router;