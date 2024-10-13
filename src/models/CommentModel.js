const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          // Regular expression for validating email format
          const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
          return reg.test(value);
        },
        message: 'Invalid email format'
      }
    },
    phone: { type: String, required: true },
    content: { type: String },
    replyBy: [{
      adminId: String,
      fullname: String,
      content: String
    }],
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour'
    }
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
