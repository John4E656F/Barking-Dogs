const router = require("express").Router();

const barkController = require("../controllers/barkController");
const authController = require("../controllers/authController");
const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentController");
const bookmarkController = require("../controllers/bookmarkController");
const rebarkController = require("../controllers/rebarkController");
const { upload } =require("../utils/upload");
const { route } = require("./userRoute");

//For Logged-in users
router.use(authController.protect);

router
    .route("/")
    .get(barkController.getAllBarks)
    .post(upload.single("media"), barkController.createBark);

//Related To Like
router.get("/like/users/:id", likeController.getLikedUserOfBark);
router.post("/like/:id", likeController.likeBark);
router.post("/unlike/:id", likeController.unlikeBark);

//Related To Comment
router.get("/comment/:id", commentController.getCommentsOfBark);
router.post("/comment/:id", commentController.createComment);
router.delete("/comment/remove/:id", commentController.deleteComment);

//Related To Bookmark
router.post("/bookmark/:id", bookmarkController.addBookmark);
router.delete("/bookmark/:id", bookmarkController.removeBookmark);

//Related To Rebark
router.get("/rebark/:id", rebarkController.getRebarkedUserOfBark);
router.post("/rebark/:id", rebarkController.createRebark);
router.delete("/rebark/:id", rebarkController.deleteRebark);

router
    .route("/:id")
    .get(barkController.getBark)
    .patch(barkController.updateMyBark)
    .delete(barkController.deleteMyBark);

module.exports = router;