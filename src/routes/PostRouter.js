const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create", postController.createPost);
router.get("/get-all-post", postController.getAllPost);
router.delete("/delete-post/:id", authMiddleWare, postController.deletePost);
router.put("/update-post/:id", authMiddleWare, postController.updatePost);
router.get("/get-details-post/:id", postController.getDetailsPost);
router.put("/addLike/:id", authUserMiddleWare, postController.addLike);
router.delete("/deleteLike/:id", authUserMiddleWare, postController.deleteLike);
router.post("/get-post-liked", authUserMiddleWare, postController.getPostLiked);
router.get("/get-like-post/:id", postController.getLikePost);
module.exports = router;
