const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const food = mongoose.model("Food", foodSchema);
module.exports = food;
