const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
    {
        tour_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
        email_book: { type: String, required: true },
        phone_book: { type: String, required: true },
        fullname_book: { type: String, required: true },
        aduld_ticket: { type: String, required: true },
        child_ticket: { type: String, required: true },
        total_price: { type: String, required: true },
        payment_date: { type: Date, required: true },
        payment_status: { type: String },
        payment_method_name: {
            type: String,
            enum: ['vnpay', 'paypal', 'cash']
        }
    },
    {
        timestamps: true,
    }
);

const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;
