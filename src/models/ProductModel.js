const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    discount: { type: Number },
    selled: { type: Number }
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
