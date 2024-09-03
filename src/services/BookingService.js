const mongoose = require('mongoose');
const bookingModel = require('../models/BookingModel');
const tourModel = require('../models/TourModel')
const moment = require('moment');
moment.locale('vi')
const createBooking = async (data) => {

    const {
        tour_id,
        hotel_level,
        email,
        phone,
        fullname,
        adult_ticket,
        child_ticket,
        payment_method_name
    } = data

    if (!tour_id ||
        !hotel_level ||
        !email ||
        !phone ||
        !fullname ||
        !adult_ticket ||
        !payment_method_name) {
        const error = new Error('The input in required!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    let total_price = await calculateTotalPrice({ tour_id, hotel_level, adult_ticket, child_ticket })

    let booking = await bookingModel.create({
        tour_id,
        hotel_level,
        email,
        phone,
        fullname,
        adult_ticket,
        child_ticket,
        payment_method_name,
        total_price
    })
    const hotelInfo = await booking.getHotelInfo(); // Sử dụng phương thức tùy chỉn
    const bookingObject = booking.toObject({ virtuals: true });
    bookingObject.hotel_info = hotelInfo
    return bookingObject

}
const getBookDetail = async (params) => {
    const id = params.id || null
    if (!id) {
        const error = new Error('The input in required!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = "ERROR";
        throw error;
    }
    const booking = await bookingModel.findById(validId).populate('hotel_level tour_id')
    const hotelInfo = await booking.getHotelInfo(); // Sử dụng phương thức tùy chỉn
    const bookingObject = booking.toObject({ virtuals: true });
    bookingObject.hotel_info = hotelInfo
    return bookingObject
}
const updateBooking = async (params, data) => {
    const id = params.id || null

    if (!id) {
        const error = new Error('The input in required!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = "ERROR";
        throw error;
    }

    const updateBooking = await bookingModel
        .findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

    if (!updateBooking) {
        const error = new Error('Not found booking');
        error.status = "ERROR"
        error.statusCode = 404; // Bad Request
        throw error;
    }
    return updateBooking
}
//Tính tổng giá
const calculateTotalPrice = async ({ tour_id, hotel_level, adult_ticket, child_ticket = 0 }) => {
    // Truy xuất tour
    const tour = await tourModel.findById(tour_id).exec();
    if (!tour) {
        throw new Error('Tour not found');
    }
    // Tìm giá khách sạn
    let hotelInfo
    hotelInfo = tour.hotel_level.find(h => h.star == hotel_level);

    if (!hotelInfo) {
        hotelInfo = {}
        hotelInfo.price_adult = 0
        hotelInfo.price_child = 0
    }

    // Tính tổng giá
    const basePriceAdult = parseFloat(tour.base_price_adult);
    const basePriceChild = parseFloat(tour.base_price_child);
    const priceHotelAdult = parseFloat(hotelInfo.price_adult);
    const priceHotelChild = parseFloat(hotelInfo.price_child);

    const totalPrice =
        (basePriceAdult * adult_ticket) +
        (priceHotelAdult * adult_ticket) +
        (basePriceChild * child_ticket) +
        (priceHotelChild * child_ticket)

    return totalPrice;
};

const getBookings = async (query) => {
    const page = query.page || 1
    const limit = query.limit || 10
    const sort = query.sort || "desc"
    const sortBy = query.sortBy || "createdAt"
    const tour_code = (query.tour_code) || null;

    const tour_name = query.tour_name || null
    const filter = {}

    const skip = (page - 1) * limit;
    // Lọc theo tour code
    if (tour_code) {
        filter.tour_code = tour_code
    }

    //  Lọc theo tên tour
    if (tour_name) {
        filter.name = { $regex: tour_name, $options: 'i' };
    }

    let total = await bookingModel.find().populate({
        path: 'tour_id', // Trường được liên kết với bảng Tour
        match: filter, // Điều kiện lọc theo tour_code
    }).count()
    let totalPage = Math.ceil(total / limit)

    const bookings = await bookingModel.find().populate({
        path: 'tour_id', // Trường được liên kết với bảng Tour
        match: filter, // Điều kiện lọc theo tour_code
    })
        .sort({ sortBy: sort })
        .limit(limit)
        .skip(skip);
    const filteredBookings = bookings.filter(booking => booking.tour_id !== null);
    return { booking: filteredBookings, sort, sortBy, totalPage, limit }

}
const updatePaymentInfo = async (params, data) => {
    const { transactionId } = data
    const id = params.id || null
    if (!id || !transactionId) {
        const error = new Error('The input in required!');
        error.status = "ERROR"
        error.statusCode = 400; // Bad Request
        throw error;
    }
    // check a valid id
    const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = "ERROR";
        throw error;
    }

    let bookingDb = await bookingModel.findOne({ _id: validId })

    if (!bookingDb) {
        const error = new Error('Booking not found');
        error.status = "ERROR"
        error.statusCode = 404; // Bad Request
        throw error;
    }
    //update info
    bookingDb.transactionId = transactionId
    bookingDb.payment_status = "payment_confirmed"

    let updated = await bookingDb.save()
    if (!updated) {
        const error = new Error("Somethings were wrong");
        error.status = "ERROR";
        error.statusCode = 500; // Bad Request
        throw error;
    }
    return updated

}
module.exports = {
    createBooking,
    getBookDetail,
    updateBooking,
    getBookings,
    updatePaymentInfo
}
