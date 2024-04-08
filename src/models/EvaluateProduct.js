const mongoose = require("mongoose");
const evaluateSchema = new mongoose.Schema(
  {
    name: { type: String },
    avatar: { type: String },
    description: { type: String, required: true },
    rating: { type: Number, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // product: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Product",
    //   required: true,
    // },
    evaluateAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Evaluate = mongoose.model("Evaluate", evaluateSchema);
module.exports = Evaluate;
