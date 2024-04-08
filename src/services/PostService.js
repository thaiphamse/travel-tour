const Post = require("../models/PostModel");
// const bcrypt = require("bcrypt");
const EmailService = require("./EmailService");
const createPost = (newPost) => {
  return new Promise(async (resolve, reject) => {
    const { title, content, likeCount, image } = newPost;
    try {
      const createPost = await Post.create({
        title,
        content,
        likeCount,
        image,
      });
      if (createPost) {
        resolve({
          status: "OK",
          message: "success",
          data: createPost,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllPost = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allPost = await Post.find();
      resolve({
        status: "OK",
        message: "success",
        data: allPost,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deletePost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPost = await Post.findOne({
        _id: id,
      });
      if (checkPost === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await Post.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updatePost = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPost = await Post.findOne({
        _id: id,
      });
      if (checkPost === null) {
        resolve({
          status: "OK",
          message: "The post is not defined",
        });
      }
      const updatePost = await Post.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "success",
        data: updatePost,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsPost = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findOne({
        _id: id,
      });
      if (post === null) {
        resolve({
          status: "OK",
          message: "The post is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: post,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const addLike = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { likeCount } = data;

      // Kiểm tra xem người theo dõi đã tồn tại chưa
      const index = likeCount.findIndex((like) => like.user === likeCount.user);

      if (index === -1) {
        // Nếu người theo dõi chưa tồn tại, thêm vào mảng
        const updateLikeCount = await Post.findByIdAndUpdate(
          id,
          {
            $addToSet: { likeCount: likeCount },
          },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "Thành công",
          data: updateLikeCount,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteLike = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findOne({
        "likeCount.user": id,
      });
      if (post === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
        return;
      }
      post.likeCount = post.likeCount.filter(
        (like) => like.user.toString() !== id
      );
      await post.save();

      resolve({
        status: "OK",
        message: "Delete follower success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getPostLiked = async (idUser) => {
  return new Promise(async (resolve, reject) => {
    const { userId } = idUser;
    try {
      const posts = await Post.find({
        "likeCount.user": userId,
      });
      if (posts === null) {
        return {
          status: "OK",
          message: "No posts found for the user.",
          data: [],
        };
      }
      const arrPostLiked = posts.map((post) => post?._id);
      resolve({
        status: "OK",
        message: "success",
        data: arrPostLiked,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getLikePost = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.findOne({
        _id: id,
      });
      if (posts === null) {
        return {
          status: "OK",
          message: "No posts found for the user.",
        };
      }
      const numberLike = posts?.data?.likeCount?.length
      resolve({
        status: "OK",
        message: "success",
        data: numberLike,
      });
    } catch (e) {
      reject(e);
    }
  });
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
