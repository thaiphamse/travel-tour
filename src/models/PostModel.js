const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
    likeCount: [
      {
        name: { type: String, required: true },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    type: { type: String },
    image: [
      {
        urlImage: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
