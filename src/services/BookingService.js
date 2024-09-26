const mongoose = require('mongoose');
const bookingModel = require('../models/BookingModel');
const tourModel = require('../models/TourModel')
const userModel = require('../models/UserModel')
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
        payment_method_name,
        start_date,
        end_date
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
    const validId = mongoose.Types.ObjectId.isValid(tour_id) ? new mongoose.Types.ObjectId(tour_id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = "ERROR";
        error.statusCode = 400
        throw error;
    }
    let total_price = await calculateTotalPrice({ tour_id: validId, hotel_level, adult_ticket, child_ticket })

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
        end_date
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
        error.statusCode = 400
        throw error;
    }
    const booking = await bookingModel.findById(validId).populate('hotel_level tour_id tour_guide')
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
        error.statusCode = 400
        throw error;
    }

    if (data.tour_guide) {
        const { role } = await userModel.findOne({ _id: data.tour_guide }).select('role')
        console.log(role)
        if (role !== 'employee') {
            const error = new Error('Không thể phân công admin');
            error.status = "ERROR"
            error.statusCode = 400;
            throw error;
        }
    }

    const updateBooking = await bookingModel.findOneAndUpdate({ _id: id }, data, { new: true })
        .populate('tour_guide tour_id')

    if (!updateBooking) {
        const error = new Error('Not found booking');
        error.status = "ERROR"
        error.statusCode = 404;
        throw error;
    }
    return updateBooking
}
//Tính tổng giá
const calculateTotalPrice = async (
    {
        tour_id,
        hotel_level,
        adult_ticket,
        child_ticket = 0
    }) => {
    // Truy xuất tour
    const tour = await tourModel.findById(tour_id).exec();
    if (!tour) {
        let error = new Error()
        error.message = "Tour not found"
        error.status = "ERROR";
        error.statusCode = 404
        throw error;
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
    const sdate = query.sdate || null
    const edate = query.edate || null
    const tour_name = query.tour_name || null
    const filter = {}
    const filterFind = {}
    const skip = (page - 1) * limit;

    // Lọc theo tour code
    if (tour_code) {
        filter.tour_code = tour_code
    }
    // Lọc theo ngày bắt đầu
    if (sdate) {
        filterFind.createdAt = { $gte: moment(sdate).startOf('day').toDate() };  // chuyển sdate thành đối tượng Date
    }

    if (edate) {
        filterFind.createdAt = { ...filterFind.createdAt, $lte: moment(edate).endOf('day').toDate() };  // chuyển edate thành đối tượng Date
    }

    //  Lọc theo tên tour
    if (tour_name) {
        filter.name = { $regex: tour_name, $options: 'i' };
    }

    let total = await bookingModel.find(filterFind).populate({
        path: 'tour_id', // Trường được liên kết với bảng Tour
        match: filter, // Điều kiện lọc theo tour_code
    }).count()
    let totalPage = Math.ceil(total / limit)

    const bookings = await bookingModel.find(filterFind)
        .populate({
            path: 'tour_id', // Trường được liên kết với bảng Tour
            match: filter, // Điều kiện lọc theo tour_code
        })
        .populate("tour_guide")

        .sort([[`${sortBy}`, `${sort}`]])
        .limit(limit)
        .skip(skip);

    const filteredBookings = bookings.filter(booking => booking.tour_id !== null);
    return { booking: filteredBookings, sort, sortBy, totalPage, limit }

}
const getBookingsByGroup = async ({ groupNumber, tour }) => {
    if (groupNumber) {
        return await bookingModel.find({ tour_id: tour, group_number: groupNumber })
            .populate('tour_id tour_guide');
    }
    // Tìm tất cả các số nhóm khác nhau
    const groups = await bookingModel.aggregate([
        {
            $group: {
                _id: '$group_number'
            }
        }
    ]);
    //Truy vấn tất cả các booking trong từng nhóm
    const groupNumbers = groups.map(group => group._id);
    const bookingsGrouped = await bookingModel.find({ tour_id: tour, group_number: { $in: groupNumbers } })
        .populate('tour_id tour_guide');

    // Bước 3: Tạo cấu trúc dữ liệu nhóm và booking
    const result = groupNumbers.map(groupNumber => ({
        group_number: groupNumber,
        bookings: bookingsGrouped.filter(booking => booking.group_number === groupNumber)
    }));

    return result;

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
        error.statusCode = 400
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
const getMyBooking = async (query, body) => {
    const page = query.page || 1
    const limit = query.limit || 10
    const sort = query.sort || "desc"
    const sortBy = query.sortBy || "createdAt"
    const email = body.email || null
    const tour_name = query.tour_name || null
    const filter = {}
    const filterFind = {}
    const skip = (page - 1) * limit;

    // Lọc theo email khách hàng
    if (email) {
        filterFind.email = email
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

    const bookings = await bookingModel.find(filterFind).populate({
        path: 'tour_id', // Trường được liên kết với bảng Tour
        match: filter, // Điều kiện lọc theo tour_code
    })
        .sort([[`${sortBy}`, `${sort}`]])
        .limit(limit)
        .skip(skip);
    const filteredBookings = bookings.filter(booking => booking.tour_id !== null);
    return { booking: filteredBookings, sort, sortBy, totalPage, limit }
}
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
    const group_number = data.group_number
    const tour_guide_id = data.tour_guide_id
    const tour_id = data.tour_id

    if (!group_number ||
        !tour_guide_id ||
        !tour_id) {
        const error = new Error("The input is required");
        error.status = "ERROR";
        error.statusCode = 400
        throw error;
    }

    try {
        const tourGuide = await userModel.findOne({ _id: tour_guide_id })
        if (!tourGuide) {
            const error = new Error("Tour guide is not found!");
            error.status = "ERROR";
            error.statusCode = 404
            throw error;
        }
        // Lấy ra các thông tin khách hàng trong 1 đoàn để update tour_guide
        return await bookingModel.updateMany(
            {
                group_number: group_number,
                tour_id: tour_id
            },
            { tour_guide: tourGuide },
            { new: true }
        )
        // return await
    } catch (err) {
        const error = new Error(err.message);
        error.status = "ERROR";
        error.statusCode = 500
        throw error;
    }
}
module.exports = {
    createBooking,
    getBookDetail,
    updateBooking,
    getBookings,
    updatePaymentInfo,
    getMyBooking,
    // checkFreeScheduleUser,
    getBookingsByGroup,
    assignmentGuideToBookings
}
