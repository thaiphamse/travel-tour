const CommentService = require("../services/CommentService");
const JwtService = require("../services/JwtService");

const createComment = async (req, res) => {
  try {
    const { name, avatar, content } = req.body;
    if (!content || !name || !avatar) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await CommentService.createComment(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllComment = async (req, res) => {
  try {
    const response = await CommentService.getAllComment();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllCommentByIdPost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(200).json({
        status: "ERR",
        message: "The postId is required",
      });
    }
    const response = await CommentService.getAllCommentByIdPost(postId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    if (!commentId) {
      return res.status(200).json({
        status: "ERR",
        message: "The commentId is required",
      });
    }
    const response = await CommentService.deleteComment(commentId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createComment,
  getAllCommentByIdPost,
  deleteComment,
  getAllComment
};
