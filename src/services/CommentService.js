const Comment = require("../models/CommentModel");
// const bcrypt = require("bcrypt");
const EmailService = require("./EmailService");
const createComment = (newComment) => {
  return new Promise(async (resolve, reject) => {
    const { name, avatar, content, user, post } = newComment;
    try {
      const createComment = await Comment.create({
        name,
        avatar,
        content,
        user,
        post,
      });
      if (createComment) {
        resolve({
          status: "OK",
          message: "success",
          data: createComment,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllCommentByIdPost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comment = await Comment.find({
        post: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (comment === null) {
        resolve({
          status: "ERR",
          message: "The comment is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: comment,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteComment = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkComment = await Comment.findOne({
        _id: id,
      });
      if (checkComment === null) {
        resolve({
          status: "OK",
          message: "The comment is not defined",
        });
      }
      await Comment.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllComment = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const comment = await Comment.find();
      if (comment === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: comment,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createComment,
  getAllCommentByIdPost,
  deleteComment,
  getAllComment
};
