const express = require("express");
const router = express.Router();
const commentController = require("../controllers/CommentController");
const {
    authMiddleWare,
    // authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");


router.post('/', commentController.createComment)
router.post('/:id/reply', authMiddleWare, commentController.adminReply)
router.delete('/:id', commentController.deleteOne)

router.get('/:id', commentController.getOne)
router.get('/', commentController.getAll)
module.exports = router;
