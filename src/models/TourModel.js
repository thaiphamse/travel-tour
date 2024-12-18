const mongoose = require("mongoose");
const TourSchema = new mongoose.Schema(
  {
    tour_code: {
      type: String,
      unique: [true, "tour_code is an unique value"],
      required: [true, 'tour_code is required'],
      set: function (value) {
        return value.toUpperCase()
      }
    },
    image: [{
      url: String,
      type: {
        type: String,
        enum: ["banner", "photos", "slide"]
      }
    }],
    name: { type: String, required: true },
    description: [{ type: Object }],
    shedule_on_week: { type: String },
    start_location: { type: String, required: true },
    end_location: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    transportation: { type: String, enum: ['plane', 'car'], default: 'car', required: true },
    base_price_adult: {
      type: Number,
      required: [true, "base_price_adult is a required value"],
      default: 0.00
    },
    base_price_child: {
      type: Number,
      required: [true, "base_price_child is a required value"],
      default: 0.00
    },
    hotel_level: [
      {
        star: { type: Number, required: true },
        price_adult: { type: String, required: true, default: 0 },
        price_child: { type: String, required: true, default: 0 },
      },
    ],
    schedules: [
      {
        day: Number,
        detail: [{ type: Object, required: true }],
      }
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category-tour'
    },
    provinceId: [
      {
        type: Number,
      }
    ],
    view: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const tour = mongoose.model("Tour", TourSchema);
module.exports = tour;
