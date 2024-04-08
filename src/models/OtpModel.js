const mongoose = require("mongoose");
const OtpSchema = new mongoose.Schema(
  {
    email: { type: String },
    otp: { type: String },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("Otp", OtpSchema);
module.exports = Otp;
