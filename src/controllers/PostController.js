const PostService = require("../services/PostService");
const JwtService = require("../services/JwtService");
const { post } = require("../routes/PostRouter");

const createPost = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title || !content || !type) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await PostService.createPost(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllPost = async (req, res) => {
  try {
    const response = await PostService.getAllPost();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const data = req.body;
    if (!postId) {
      return res.status(200).json({
        status: "ERR",
        message: "The postId is required",
      });
    }
    const response = await PostService.updatePost(postId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await PostService.deletePost(postId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsPost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(200).json({
        status: "ERR",
        message: "The postId is required",
      });
    }
    const response = await PostService.getDetailsPost(postId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const addLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const data = req.body;
    if (!postId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await PostService.addLike(postId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteLike = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await PostService.deleteLike(postId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getPostLiked = async (req, res) => {
  try {
    const { userId } = req.body;
    const response = await PostService.getPostLiked(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getLikePost = async (req, res) => {
  try {
    const idPost = req.params.id;
    const response = await PostService.getLikePost(idPost);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createPost,
  getAllPost,
  deletePost,
  updatePost,
  getDetailsPost,
  addLike,
  deleteLike,
  getPostLiked,
  getLikePost,
};
