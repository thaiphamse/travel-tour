const mongoose = require("mongoose");
const bookingModel = require("../models/BookingModel");
const tourModel = require("../models/TourModel");
const userModel = require("../models/UserModel");
const moment = require("moment");
const { query } = require("express");
const emailService = require("./EmailService");
moment.locale("vi");

const createBooking = async (data) => {
  const {
    tour_id,
    hotel_level,
    email,
    phone,
    fullname,
    adult_ticket,
    child_ticket,
    payment_method_name,
    start_date,
    end_date,
    note,
    address,
  } = data;

  if (
    !tour_id ||
    !hotel_level ||
    !email ||
    !phone ||
    !fullname ||
    !adult_ticket ||
    !payment_method_name ||
    !address
  ) {
    const error = new Error("The input in required!");
    error.status = 400;
    throw error;
  }
  const validId = mongoose.Types.ObjectId.isValid(tour_id)
    ? new mongoose.Types.ObjectId(tour_id)
    : null;
  if (!validId) {
    const error = new Error("Invalid ID format");
    error.status = 400;
    throw error;
  }
  let total_price = await calculateTotalPrice({
    tour_id: validId,
    hotel_level,
    adult_ticket,
    child_ticket,
  });
  //Phân công nhân sự
  let booking = await bookingModel.create({
    tour_id,
    hotel_level,
    email,
    phone,
    fullname,
    adult_ticket,
    child_ticket,
    payment_method_name,
    total_price,
    start_date,
    end_date,
    note,
    address,
  });

  const hotelInfo = await booking.getHotelInfo(); // Sử dụng phương thức tùy chỉn
  const bookingObject = booking.toObject({ virtuals: true });
  bookingObject.hotel_info = hotelInfo;
  if (booking) {
    const populatedBooking = await bookingModel
      .findById(booking._id)
      .populate("tour_id", "name");
    //Send mail
    await emailService.sendEmailCreateOrder({
      to: email,
      data: populatedBooking,
    });
  }
  return bookingObject;
};
const getBookDetail = async (params) => {
  const id = params.id || null;
  if (!id) {
    const error = new Error("The input in required!");
    error.status = 400;
    throw error;
  }
  const validId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;
  if (!validId) {
    const error = new Error("Invalid ID format");
    error.status = 400;
    throw error;
  }
  const booking = await bookingModel
    .findById(validId)
    .populate("hotel_level tour_id tour_guide");
  const hotelInfo = await booking.getHotelInfo(); // Sử dụng phương thức tùy chỉn
  const bookingObject = booking.toObject({ virtuals: true });
  bookingObject.hotel_info = hotelInfo;
  return bookingObject;
};

const updateBooking = async (params, data) => {
  const session = await mongoose.startSession(); // Bắt đầu phiên giao dịch
  session.startTransaction(); // Khởi tạo transaction

  const id = params.id || null;
  let updatedBooking; //Lưu tt update dùng trong block finally
  let bk_db;
  try {
    if (!id) {
      const error = new Error("The input in required!");
      error.status = 400;
      throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!validId) {
      const error = new Error("Invalid ID format");
      error.status = 400;
      throw error;
    }
    //Nếu có ngày điều chỉnh ngày thì phần nhóm lại
    const bookingDb = await bookingModel
      .findOne({
        _id: validId,
      })
      .select("start_date end_date");
    console.log("bookingDb ", bookingDb, data.start_date, data.end_date);
    console.log(bookingDb.start_date != data.start_date);
    const startTimeDb = new Date(bookingDb.start_date).getTime();
    const endTimeDb = new Date(bookingDb.end_date).getTime();
    const startTime = new Date(data.start_date).getTime();
    const endTime = new Date(data.end_date).getTime();

    bk_db = await bookingModel
      .findById(id) //Lưu tt status trước khi cập nhật
      .select("payment_status");

    if ((data.start_date && data.end_date) && (startTimeDb !== startTime || endTimeDb !== endTime)) {
      console.log("phan nhom lai");
      //Tìm xem có nhóm nào xuất phát đúng thời gian này hay không
      let booking = await bookingModel
        .findOne({ _id: validId })
        .select("tour_id child_ticket adult_ticket")
        .session(session);

      if (!booking) {
        const error = new Error("Not found booking to update");
        error.status = 404;
        throw error;
      }

      let tour_id = booking.tour_id;
      let filter = {};
      filter.tour_id = tour_id;
      filter.start_date = data.start_date;
      filter.end_date = data.end_date;
      //Lấy ra group_number max trong db theo tour_id và ngày xuất phát, end_date
      const maxGroupNumber = await mongoose
        .model("Booking")
        .find(filter)
        .sort({ group_number: "descending" })
        .limit(1)
        .select("group_number")
        .session(session);

      console.log(filter, maxGroupNumber);
      //Đếm số vé có lớn hơn 10 chưa
      // Tìm nhóm hiện tại có số lượng booking
      let groupName = `1-(${moment(filter.start_date)
        .utcOffset("+07:00")
        .format("HH[h]mm-DD/MM/YYYY")}->${moment(filter.end_date)
          .utcOffset("+07:00")
          .format("HH[h]mm-DD/MM/YYYY")})`;

      if (maxGroupNumber.length > 0) {
        groupName = maxGroupNumber[0].group_number;
      }

      let maxNumber = groupName.split("-")[0];
      const bookingsInGroup = await bookingModel
        .find({
          ...filter,
          group_number: groupName,
        })
        .session(session);
      // Tính tổng số vé hiện tại trong nhóm
      const currentGroupTotalTickets = bookingsInGroup.reduce(
        (sum, booking) => {
          return sum + booking.adult_ticket + booking.child_ticket;
        },
        0
      );

      let thisNewTicket = booking.adult_ticket + booking.child_ticket;

      if (currentGroupTotalTickets + thisNewTicket > 10) {
        // Cập nhật group_number cho booking mới
        console.log(1);

        booking.group_number =
          Number(maxNumber) +
          1 +
          `-(${moment(filter.start_date)
            .utcOffset("+07:00")
            .format("HH[h]mm-DD/MM/YYYY")}->${moment(filter.end_date)
              .utcOffset("+07:00")
              .format("HH[h]mm-DD/MM/YYYY")})`;
      } else {
        booking.group_number = groupName;
        console.log(2);

        booking.tour_guide = bookingsInGroup[0]?.tour_guide;
      }
      await booking.save({ session });
      // return
    }
    if (data.payment_status === "employee_confirmed") {
      data.payment_date = new Date();
    }
    const updateBooking = await bookingModel
      .findOneAndUpdate({ _id: id }, data, { new: true })
      .populate("tour_guide tour_id")
      .session(session);

    if (!updateBooking) {
      const error = new Error("Not found booking");
      error.status = 404;
      throw error;
    }
    // Commit transaction nếu mọi thứ thành công
    await session.commitTransaction();
    updatedBooking = updateBooking;

    return updateBooking;
  } catch (error) {
    console.log("roll back");
    console.log(error);
    await session.abortTransaction();
    throw error;
  } finally {
    console.log("bk_db", bk_db);
    if (
      data.payment_status === "employee_confirmed" &&
      bk_db.payment_status !== "employee_confirmed"
    ) {
      console.log("sendmail");
      await emailService.sendEmailSuccessBooking({
        to: updatedBooking.email,
        data: updatedBooking,
      });
    }
    // Kết thúc session dù có lỗi hay không
    console.log("End");

    session.endSession();
  }
};

//Tính tổng giá
const calculateTotalPrice = async ({
  tour_id,
  hotel_level,
  adult_ticket,
  child_ticket = 0,
}) => {
  // Truy xuất tour
  const tour = await tourModel.findById(tour_id).exec();
  if (!tour) {
    let error = new Error();
    error.message = "Tour not found";
    error.status = 404;
    throw error;
  }
  // Tìm giá khách sạn
  let hotelInfo;
  hotelInfo = tour.hotel_level.find((h) => h.star == hotel_level);

  if (!hotelInfo) {
    hotelInfo = {};
    hotelInfo.price_adult = 0;
    hotelInfo.price_child = 0;
  }

  // Tính tổng giá
  const basePriceAdult = parseFloat(tour.base_price_adult);
  const basePriceChild = parseFloat(tour.base_price_child);
  const priceHotelAdult = parseFloat(hotelInfo.price_adult);
  const priceHotelChild = parseFloat(hotelInfo.price_child);

  const totalPrice =
    basePriceAdult * adult_ticket +
    priceHotelAdult * adult_ticket +
    basePriceChild * child_ticket +
    priceHotelChild * child_ticket;

  return totalPrice;
};

const getBookings = async (query) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const sort = query.sort || "desc";
  const sortBy = query.sortBy || "createdAt";
  const tour_code = query.tour_code || null;
  const sdate = query.sdate || null;
  const edate = query.edate || null;
  const tour_name = query.tour_name || null;
  const filter = {};
  const filterFind = {};
  const skip = (page - 1) * limit;
  const status = query.status || null;
  const is_cancel = query.is_cancel || false;
  const is_checking = query.is_checking || false;

  if (is_cancel === "true") {
    filterFind.is_cancel = true;
  }
  if (is_checking === "true") {
    filterFind.is_checking = true;
  }

  if (status) {
    filterFind.payment_status = status;
  }
  // Lọc theo tour code
  if (tour_code) {
    filter.tour_code = tour_code;
  }
  // Lọc theo ngày bắt đầu
  if (sdate) {
    filterFind.createdAt = { $gte: moment(sdate).startOf("day").toDate() }; // chuyển sdate thành đối tượng Date
  }

  if (edate) {
    filterFind.createdAt = {
      ...filterFind.createdAt,
      $lte: moment(edate).endOf("day").toDate(),
    }; // chuyển edate thành đối tượng Date
  }

  //  Lọc theo tên tour
  if (tour_name) {
    filter.name = { $regex: tour_name, $options: "i" };
  }
  console.log(filterFind);

  let total = await bookingModel
    .find(filterFind)
    .populate({
      path: "tour_id", // Trường được liên kết với bảng Tour
      match: filter, // Điều kiện lọc theo tour_code
    })
    .count();
  let totalPage = Math.ceil(total / limit);

  const bookings = await bookingModel
    .find(filterFind)
    .populate({
      path: "tour_id", // Trường được liên kết với bảng Tour
      match: filter, // Điều kiện lọc theo tour_code
    })
    .populate("tour_guide")

    .sort([[`${sortBy}`, `${sort}`]])
    .limit(limit)
    .skip(skip);

  const filteredBookings = bookings.filter(
    (booking) => booking.tour_id !== null
  );
  return { booking: filteredBookings, sort, sortBy, totalPage, limit };
};
const getBookingsByGroup = async ({ query }) => {
  // Tìm tất cả các số nhóm khác nhau
  const tours = await bookingModel.aggregate([
    // {
    //   $match: {
    //     is_cancel: false,
    //   },
    // },
    {
      $group: {
        _id: "$tour_id",
      },
    },
    {
      $sort: { start_date: 1 },
    },
  ]);

  let dataRes = [];
  let filterBooking = {};
  const tour_guide = query.tour_guide || null;
  const start_date = query.start_date || null;

  let startofDate = moment(start_date, "MM/DD/YYYY").startOf("day").toDate()
  let endOfDate = moment(start_date, "MM/DD/YYYY").endOf("day").toDate()

  if (start_date) {
    filterBooking.start_date = {
      $gte: startofDate,
      $lte: endOfDate,
    };
  }

  if (tour_guide === "false") {
    filterBooking.tour_guide = { $eq: null };
  } else if (tour_guide === "true") {
    filterBooking.tour_guide = { $exists: true, $ne: null };
  }
  console.log(filterBooking);

  for (const tour of tours) {
    //Lấy tất cả tour_id
    const group_numbers = await bookingModel.aggregate([
      {
        // Điều kiện để lọc các booking theo tour_id
        $match: {
          tour_id: tour._id,
          is_cancel: false,
          ...filterBooking,
        },
      },
      {
        // Nhóm kết quả theo group_number
        $group: {
          _id: "$group_number", // Nhóm theo group_number
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);
    console.log(group_numbers);
    //group_numbers là danh sách số nhóm theo từng tour_id
    const groupNumbers = group_numbers.map((group) => group._id);

    const bookingsGrouped = await bookingModel
      .find({
        tour_id: tour._id,
        // start_date: filter.start_date,
        group_number: {
          $in: groupNumbers,
        },
        ...filterBooking, // Không có tour_guide
      })
      .populate("tour_id tour_guide")
      .sort({ createdAt: "asc" });
    // console.log(bookingsGrouped, groupNumbers, filterBooking)

    if (bookingsGrouped.length === 0) {
      continue;
    }
    // // Bước 3: Tạo cấu trúc dữ liệu nhóm và booking
    const result = groupNumbers.map((groupNumber) => {
      // Lọc các bookings thuộc group_number hiện tại
      const bookingsInGroup = bookingsGrouped.filter(
        (booking) => booking.group_number === groupNumber
      );

      // Nếu có booking trong nhóm, lấy start_date và end_date từ booking đầu tiên
      let start_date = null;
      let end_date = null;

      if (bookingsInGroup.length > 0) {
        start_date = bookingsInGroup[0].start_date;
        end_date = bookingsInGroup[0].end_date;
      }

      return {
        group_number: groupNumber,
        start_date,
        end_date,
        bookings: bookingsInGroup, // Các booking thuộc nhóm này
      };
    });

    let tourDb = await tourModel.findById(tour._id);
    dataRes.push({
      tour: tourDb,
      groups: result,
    });
  }
  return dataRes;
};

const updatePaymentInfo = async (params, data) => {
  const { transactionId } = data;
  const id = params.id || null;
  if (!id || !transactionId) {
    const error = new Error("The input in required!");
    error.status = 400;
    throw error;
  }
  // check a valid id
  const validId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;
  if (!validId) {
    const error = new Error("Invalid ID format");
    error.status = 400;
    throw error;
  }

  let bookingDb = await bookingModel.findOne({ _id: validId });

  if (!bookingDb) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  //update info
  bookingDb.transactionId = transactionId;
  bookingDb.payment_status = "payment_confirmed";
  bookingDb.payment_method_name = "paypal";
  bookingDb.payment_date = new Date();

  let updated = await bookingDb.save();
  if (!updated) {
    const error = new Error("Somethings were wrong");
    error.status = 500;
    throw error;
  }
  let updatedPupulation = await bookingModel
    .findById(updated._id)
    .populate("tour_id", "name");

  await emailService.sendEmailPaymentConfirm({
    to: bookingDb.email,
    data: updatedPupulation,
  });
  return updated;
};
const getMyBooking = async (query, body) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const sort = query.sort || "desc";
  const sortBy = query.sortBy || "createdAt";
  const email = body.email || null;
  const tour_name = query.tour_name || null;
  const filter = {};
  const filterFind = {};
  const skip = (page - 1) * limit;

  // Lọc theo email khách hàng
  if (email) {
    filterFind.email = email;
  }
  //  Lọc theo tên tour
  if (tour_name) {
    filter.name = { $regex: tour_name, $options: "i" };
  }

  let total = await bookingModel
    .find()
    .populate({
      path: "tour_id", // Trường được liên kết với bảng Tour
      match: filter, // Điều kiện lọc theo tour_code
    })
    .count();
  let totalPage = Math.ceil(total / limit);

  const bookings = await bookingModel
    .find(filterFind)
    .populate({
      path: "tour_id", // Trường được liên kết với bảng Tour
      match: filter, // Điều kiện lọc theo tour_code
    })
    .sort([[`${sortBy}`, `${sort}`]])
    .limit(limit)
    .skip(skip);
  const filteredBookings = bookings.filter(
    (booking) => booking.tour_id !== null
  );
  return { booking: filteredBookings, sort, sortBy, totalPage, limit };
};
// Kiểm tra nhân viên rảnh trong khoảng thời gian tour
// const checkFreeScheduleUser = async (userId, startDate, endDate) => {
//     try {
//         // check valid id
//         const validId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;
//         if (!validId) {
//             const error = new Error("Invalid ID format");
//             error.status = "ERROR";
//             error.statusCode = 400
//             throw error;
//         }
//         let isExistBookingOfEmployee = await userModel.find()

//         return (isExistBookingOfEmployee)
//     } catch (error) {
//         const err = new Error()
//         err.status = "ERROR"
//         err.statusCode = 500
//         err.message = "Something were wrong!"
//         throw err
//     }
// }
const assignmentGuideToBookings = async (data) => {
  const tour_guide_id = data.tour_guide_id;
  const start_date = data.start_date;
  const end_date = data.end_date;
  const tour_id = data.tour_id;
  const group_number = data.group_number;

  if (!tour_guide_id || !start_date || !end_date || !tour_id || !group_number) {
    const error = new Error("The input is required");
    error.status = 400;
    throw error;
  }

  try {
    const tourGuide = await userModel.findOne({ _id: tour_guide_id });
    if (!tourGuide) {
      const error = new Error("Tour guide is not found!");
      error.status = 404;
      throw error;
    }
    console.log({
      start_date,
      end_date,
      group_number,
      tour_id: tour_id,
      // is_cancel: false,
    });
    // Lấy ra các thông tin khách hàng trong 1 đoàn để update tour_guide
    let data = await bookingModel.updateMany(
      {
        start_date,
        end_date,
        group_number,
        tour_id: tour_id,
        // is_cancel: false,
      },
      { tour_guide: tourGuide },
      { new: true }
    );
    console.log(data);
    if (data.modifiedCount === 0) {
      const error = new Error("Không có document nào được cập nhật");
      error.status = 400;
      throw error;
    }
    return data;

    // return await
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const checkingBooking = async (params, data) => {
  try {
    const id = params.id || null;
    return await bookingModel
      .findOneAndUpdate({ _id: id }, data, { new: true })
      .exec();
  } catch (error) {
    console.log(error);
    throw err;
  }
};
module.exports = {
  createBooking,
  getBookDetail,
  updateBooking,
  getBookings,
  updatePaymentInfo,
  getMyBooking,
  getBookingsByGroup,
  assignmentGuideToBookings,
  checkingBooking,
};
