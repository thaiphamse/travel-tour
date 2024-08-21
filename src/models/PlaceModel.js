const mongoose = require("mongoose");
const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: [{ type: Object, required: true }],
    addressString: {
      type: String,
      required: true
    },
    provinceId: {
      type: Number,
      required: true
    },
    districtId: {
      type: Number,
      required: true
    },
    wardId: {
      type: Number,
      // required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'], // Loại hình tọa độ, phải là "Point"
        // required: true
      },
      coordinates: {
        type: [Number], // Mảng lưu kinh độ và vĩ độ [longitude, latitude]
        // required: true
      }
    }
  },
  {
    timestamps: true,
  }
);

const place = mongoose.model("Place", placeSchema);
module.exports = place;
