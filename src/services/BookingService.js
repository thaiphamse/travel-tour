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
const updatePaymentInfo = async (params, data) => {
    const id = params.id || null
    const { payment_status } = data

    if (!id || !payment_status) {
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
    const updateBooking = await bookingModel.findOneAndUpdate({
        _id: id
    }, { payment_status, payment_date: moment(new Date()).format('LLLL') }, { new: true })
        .select('total_price payment_date payment_status payment_method_name')

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
    console.log(hotelInfo)

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

    console.log(basePriceAdult,
        basePriceChild,
        priceHotelAdult,
        priceHotelChild, child_ticket)
    const totalPrice =
        (basePriceAdult * adult_ticket) +
        (priceHotelAdult * adult_ticket) +
        (basePriceChild * child_ticket) +
        (priceHotelChild * child_ticket)

    return totalPrice;
};

module.exports = {
    createBooking,
    getBookDetail,
    updatePaymentInfo
}
