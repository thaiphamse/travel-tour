const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
