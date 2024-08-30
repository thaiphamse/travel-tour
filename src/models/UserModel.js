const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee',
      required: true
    },
    phone: {
      type: String,
      set: function (value) {
        // Biểu thức chính quy kiểm tra số điện thoại Việt Nam
        const vietnamPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
        // Kiểm tra số điện thoại
        if (!vietnamPhoneRegex.test(value)) {
          throw new Error('Invalid phone number format for Vietnam');
        }

        // Trả về số điện thoại hợp lệ
        return value;
      }
    },
    address: { type: String },
    avatar: { type: String },
    city: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
