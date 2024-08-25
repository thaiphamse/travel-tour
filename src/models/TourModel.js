const mongoose = require("mongoose");
const TourSchema = new mongoose.Schema(
  {
    tour_code: { type: String, unique: true, required: [true, 'tour_code is required'] },
    name: { type: String, required: true },
    description: [{ type: Object }],
    shedule_on_week: { type: String },
    transportation: { type: String, required: true },
    start_location: { type: String, required: true },
    end_location: { type: String, required: true },
    transportation: { type: String, required: true },
    base_price_adult: { type: mongoose.Schema.Types.Decimal128, default: 0.00 },
    base_price_child: { type: mongoose.Schema.Types.Decimal128, default: 0.00 },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    hodel_level: [
      {
        star: { type: Number, required: true },
        price_adult: { type: String, required: true },
        price_child: { type: String, required: true },
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
