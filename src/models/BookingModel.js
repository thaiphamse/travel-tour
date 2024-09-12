const mongoose = require("mongoose");
const tourModel = require('./TourModel')
const bookingSchema = new mongoose.Schema(
    {
        tour_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour',
            required: true
        },
        hotel_level: {
            type: Number,
            required: [true, "hotel_level is required"],
        },
        email: { type: String, required: true },
        phone: {
            type: String,
            required: true,
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
        fullname: { type: String, required: true },
        adult_ticket: { type: Number, required: true, default: 1 },
        child_ticket: { type: Number, required: true, default: 0 },
        total_price: { type: Number, required: true, default: 0 },
        transactionId: { type: String, required: true, default: "pending" },
        payment_status: {
            type: String,
            enum: ['pending', 'payment_confirmed', 'payment_failed', 'employee_confirmed'],
            default: 'pending'
        },
        payment_method_name: {
            type: String,
            enum: ['vnpay', 'paypal', 'cash']
        },
        tour_guide: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

bookingSchema.methods.getHotelInfo = async function () {
    const tour = await tourModel.findById(this.tour_id);
    if (tour) {
        return (tour.hotel_level.find(h => h.star === this.hotel_level));
    }
    return null;
};


const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;
