const mongoose = require("mongoose");
const placeSchema = new mongoose.Schema(
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
      required: true
    },
    provinceId: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

const place = mongoose.model("Place", placeSchema);
module.exports = place;
