const mongoose = require("mongoose");
const tourModel = require("./TourModel");
const moment = require("moment");
const bookingSchema = new mongoose.Schema(
  {
    tour_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
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
          throw new Error("Invalid phone number format for Vietnam");
        }

        // Trả về số điện thoại hợp lệ
        return value;
      },
    },
    fullname: { type: String, required: true },
    adult_ticket: { type: Number, required: true, default: 1 },
    child_ticket: { type: Number, required: true, default: 0 },
    total_price: { type: Number, required: true, default: 0 },
    transactionId: { type: String, required: true, default: "pending" },
    payment_status: {
      type: String,
      enum: [
        "pending",
        "payment_confirmed",
        "payment_failed",
        "employee_confirmed",
      ],
      default: "pending",
    },
    payment_method_name: {
      type: String,
      enum: ["vnpay", "paypal", "cash"],
    },
    payment_date: {
      type: Date,
    },
    tour_guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    group_number: {
      type: String,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
    },
    address: {
      type: String,
    },
    is_cancel: {
      type: Boolean,
      default: false,
    },
    is_checking: {
      type: Boolean,
      default: false,
    },
    customer_list: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
// Pre-save hook để tính toán số lượng vé và phân nhóm
bookingSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      // Tính tổng vé chuẩn bị thêm
      const totalTickets = this.adult_ticket + this.child_ticket;

      let filter = {};
      filter.tour_id = this.tour_id;

      if (this.start_date && this.end_date) {
        filter.start_date = this.start_date;
        filter.end_date = this.end_date;
      } else {
        this.group_number = null;
        return next();
      }
      console.log(filter);
      //Lấy ra group_number max trong db theo tour_id và ngày xuất phát
      const maxGroupNumber = await mongoose
        .model("Booking")
        .find(filter)
        .sort({ group_number: "descending" })
        .limit(1)
        .select("group_number");

      console.log("maxGroupNumber", maxGroupNumber)

      if (maxGroupNumber.length === 0) {
        this.group_number = `1-(${moment(this.start_date)
          .utcOffset("+07:00")
          .format("HH[h]mm-DD/MM/YYYY")}->${moment(this.end_date)
            .utcOffset("+07:00")
            .format("HH[h]mm-DD/MM/YYYY")})`;
        return next();
      }

      let maxNumberString = maxGroupNumber[0]?.group_number;
      let maxNumber = maxNumberString.split("-")[0];

      // Tìm nhóm hiện tại có số lượng booking
      const bookingsInGroup = await mongoose.model("Booking").find({
        ...filter,
        group_number: maxNumberString,
      });

      console.log(bookingsInGroup);
      // Tính tổng số vé hiện tại trong nhóm
      const currentGroupTotalTickets = bookingsInGroup.reduce(
        (sum, booking) => {
          return sum + booking.adult_ticket + booking.child_ticket;
        },
        0
      );
      console.log(currentGroupTotalTickets);

      // Nếu tổng số vé trong nhóm hiện tại cộng với vé mới vượt quá 20
      if (currentGroupTotalTickets + totalTickets > 10) {
        // Cập nhật group_number cho booking mới
        this.group_number =
          Number(maxNumber) +
          1 +
          `-(${moment(this.start_date)
            .utcOffset("+07:00")
            .format("HH[h]mm-DD/MM/YYYY")}->${moment(this.end_date)
              .utcOffset("+07:00")
              .format("HH[h]mm-DD/MM/YYYY")})`;
      } else {
        this.group_number = maxNumberString;

        //Phân công nhân sự của nhóm của vào
        //Lấy tour_guide cũ
        const bookingOld = await mongoose
          .model("Booking")
          .findOne({
            ...filter,
            group_number: this.group_number,
          })
          .select("tour_guide");
        this.tour_guide = bookingOld?.tour_guide;
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
    return tour.hotel_level.find((h) => h.star === this.hotel_level);
  }
  return null;
};

const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;
