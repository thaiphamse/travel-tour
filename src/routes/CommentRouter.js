const express = require("express");
const router = express.Router();
const commentController = require("../controllers/CommentController");
const {
    authMiddleWare,
    authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/:id', commentController.getOne)
router.post('/', commentController.createComment)

module.exports = router;
