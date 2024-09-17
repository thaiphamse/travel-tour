const express = require("express");
const router = express.Router();
const commentController = require("../controllers/CommentController");
const {
    authMiddleWare,
    // authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/:id', commentController.getOne)
router.get('/', commentController.getAll)

router.post('/', commentController.createComment)
router.delete('/:id', commentController.deleteOne)

module.exports = router;
