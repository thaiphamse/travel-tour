const mongoose = require("mongoose");
const discountSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    value: { type: Number },
    startDiscount: { type: Date },
    endDiscount: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
