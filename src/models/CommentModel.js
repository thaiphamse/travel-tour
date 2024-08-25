const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    content: { type: String, required: true },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
