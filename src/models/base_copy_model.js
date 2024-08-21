const mongoose = require("mongoose");
const placeSchema = new mongoose.Schema(
  {
    email: { type: String },
    otp: { type: String },
  },
  {
    timestamps: true,
  }
);

// const place = mongoose.model("Place", placeSchema);
// module.exports = place;
