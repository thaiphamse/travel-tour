const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: [{ type: Object, required: true }],
    image: [{
      url: String,
      type: {
        type: String,
        enum: ["banner", "photos"]
      }
    }],
    addressString: {
      type: String,
    },
    provinceId: {
      type: Number,
    },
    type: {
      type: String,
      enum: ['Food', 'Place']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    view: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const blog = mongoose.model("Blog", blogSchema);
module.exports = blog;
