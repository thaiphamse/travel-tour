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
        },
        group_number: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true,
    }
);
// Pre-save hook để tính toán số lượng vé và phân nhóm
bookingSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            // Tính tổng vé chuẩn bị thêm
            const totalTickets = this.adult_ticket + this.child_ticket;

            //Lấy ra group_number max trong db theo tour_id
            const maxGroupNumber = await mongoose.model('Booking')
                .find({ tour_id: this.tour_id, })
                .sort({ group_number: 'descending' })
                .limit(1)
                .select('group_number')
            console.log("maxGroupNumber ", maxGroupNumber)
            let maxNumber = maxGroupNumber[0]?.group_number || 1
            // Tìm nhóm hiện tại có số lượng booking
            const bookingsInGroup = await mongoose.model('Booking').find({
                tour_id: this.tour_id,
                group_number: maxNumber
            });
            console.log('bookingsInGroup ', bookingsInGroup)
            // Tính tổng số vé hiện tại trong nhóm
            const currentGroupTotalTickets = bookingsInGroup.reduce((sum, booking) => {
                return sum + booking.adult_ticket + booking.child_ticket;
            }, 0);

            console.log("tổng số vé hiện tại trong nhóm ", currentGroupTotalTickets)
            console.log("tổng vé chuẩn bị thêm ", totalTickets)

            // Nếu tổng số vé trong nhóm hiện tại cộng với vé mới vượt quá 20
            if ((currentGroupTotalTickets + totalTickets) > 20) {
                // Cập nhật group_number cho booking mới
                console.log("Tang group number")
                this.group_number = maxNumber + 1
                next()
            } else {
                this.group_number = maxNumber
            }
        }

        next(); // Chuyển sang middleware tiếp theo
    } catch (error) {
        next(error); // Chuyển lỗi đến middleware xử lý lỗi
    }
});

bookingSchema.methods.getHotelInfo = async function () {
    const tour = await tourModel.findById(this.tour_id);
    if (tour) {
        return (tour.hotel_level.find(h => h.star === this.hotel_level));
    }
    return null;
};


const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;
