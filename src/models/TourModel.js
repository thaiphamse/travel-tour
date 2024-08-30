const moment = require("moment/moment");
const mongoose = require("mongoose");
const TourSchema = new mongoose.Schema(
  {
    tour_code: {
      type: String,
      unique: [true, "tour_code is an unique value"],
      required: [true, 'tour_code is required']
    },
    image: [{
      url: String,
      type: {
        type: String,
        enum: ["banner", "photos"]
      }
    }],
    name: { type: String, required: true },
    description: [{ type: Object }],
    shedule_on_week: { type: String },
    start_location: { type: String, required: true },
    end_location: { type: String, required: true },
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
    start_date: {
      type: String,
      required: true,

    },
    end_date: {
      type: String,
      required: true,

    },
    hotel_level: [
      {
        star: { type: Number, required: true, unique: true },
        price_adult: { type: String, required: true, default: 0 },
        price_child: { type: String, required: true, default: 0 },
      },
    ],
    schedules: [
      {
        day: Number,
        detail: { type: Object, required: true },
        foods: [{
          type: mongoose.Schema.Types.ObjectId, ref: 'Food'
        }]
      }
    ]
  },
  {
    timestamps: true,
  }
);

const tour = mongoose.model("Tour", TourSchema);
module.exports = tour;
