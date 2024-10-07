const mongoose = require('mongoose');
const bookingModel = require('../models/BookingModel');
const tourModel = require('../models/TourModel')
const userModel = require('../models/UserModel')
const moment = require('moment');
const { query } = require('express');
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
        end_date,
        note,
        address
    } = data

    if (!tour_id ||
        !hotel_level ||
        !email ||
        !phone ||
        !fullname ||
        !adult_ticket ||
        !payment_method_name ||
        !address) {
        const error = new Error('The input in required!');
        error.status = 400
        throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(tour_id) ? new mongoose.Types.ObjectId(tour_id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = 400
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
        end_date,
        note,
        address
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
        error.status = 400
        throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = 400
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
        error.status = 400
        throw error;
    }
    const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = 400
        throw error;
    }

    if (data.tour_guide) {
        const { role } = await userModel.findOne({ _id: data.tour_guide }).select('role')
        if (role !== 'employee') {
            const error = new Error('Không thể phân công admin');
            error.status = 400
            throw error;
        }
    }

    //Nếu có ngày thì phần nhóm lại
    if (data.start_date && data.end_date) {
        //Tìm xem có nhóm nào xuất phát đúng thời gian này hay không
        let booking = await bookingModel.findOne({ _id: validId })
            .select('tour_id child_ticket adult_ticket')
        let tour_id = booking.tour_id
        let filter = {}
        filter.tour_id = tour_id
        filter.start_date = data.start_date
        filter.end_date = data.end_date
        console.log(filter)
        //Lấy ra group_number max trong db theo tour_id và ngày xuất phát
        const maxGroupNumber = await mongoose.model('Booking')
            .find(filter)
            .sort({ group_number: 'descending' })
            .limit(1)
            .select('group_number')
        //Đếm số vé có lớn hơn 10 chưa
        // Tìm nhóm hiện tại có số lượng booking
        let maxNumber = maxGroupNumber[0]?.group_number || 1
        console.log(maxNumber)
        const bookingsInGroup = await bookingModel.find({
            ...filter,
            group_number: maxNumber
        });
        // Tính tổng số vé hiện tại trong nhóm
        const currentGroupTotalTickets = bookingsInGroup.reduce((sum, booking) => {
            return sum + booking.adult_ticket + booking.child_ticket;
        }, 0);

        let thisNewTicket = booking.adult_ticket + booking.child_ticket

        if ((currentGroupTotalTickets + thisNewTicket) > 10) {
            // Cập nhật group_number cho booking mới
            booking.group_number = maxNumber + 1
        } else
            booking.group_number = maxNumber

        await booking.save()
    }
    // return
    const updateBooking = await bookingModel.findOneAndUpdate({ _id: id }, data, { new: true })
        .populate('tour_guide tour_id')

    if (!updateBooking) {
        const error = new Error('Not found booking');
        error.status = 404
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
        error.status = 404
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
    const status = query.status || null

    if (status) {
        filterFind.payment_status = status
    }
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
const getBookingsByGroup = async ({ groupNumber, tour, start_date, query }) => {
    // if (!tour ||
    //     !start_date
    // ) {
    //     const error = new Error("The input is required");
    //     error.status = 400
    //     throw error;
    // }
    // filter.start_date = start_date

    // filter.tour_id = tour
    if (groupNumber) {
        filter.group_number = groupNumber
        return await bookingModel
            .find(filter)
            .populate('tour_id tour_guide');
    }
    // Tìm tất cả các số nhóm khác nhau
    const tours = await bookingModel.aggregate([
        {
            $group: {
                _id: '$tour_id'
            }
        }
    ]);

    let dataRes = []
    let filterBooking = {}
    const tour_guide = query.tour_guide || null
    console.log(tour_guide)

    if (tour_guide == 'false') {
        filterBooking.tour_guide = { $exists: false, $eq: null }

    } else if (tour_guide == 'true') {
        filterBooking.tour_guide = { $exists: true, $ne: null }
    }

    for (const tour of tours) {

        //Lấy tất cả nhóm của booking
        const group_numbers = await bookingModel.aggregate([
            {
                // Điều kiện để lọc các booking theo tour_id
                $match: {
                    tour_id: tour._id
                }
            },
            {
                // Nhóm kết quả theo group_number
                $group: {
                    _id: '$group_number' // Nhóm theo group_number
                }
            },
            {
                $sort:
                    { start_date: 1 }
            }
        ]);
        //group_numbers là danh sách số nhóm theo từng tour_id

        const groupNumbers = group_numbers.map(group => group._id);

        const bookingsGrouped = await bookingModel
            .find({
                tour_id: tour._id,
                // start_date: filter.start_date,
                group_number: {
                    $in: groupNumbers
                },
                ...filterBooking // Không có tour_guide
            })
            .populate('tour_id tour_guide')
            .sort({ 'start_date': 'asc' })
        console.log(bookingsGrouped, groupNumbers, filterBooking)

        if (bookingsGrouped.length === 0) {
            continue
        }
        // // Bước 3: Tạo cấu trúc dữ liệu nhóm và booking
        const result = groupNumbers.map(groupNumber => {
            // Lọc các bookings thuộc group_number hiện tại
            const bookingsInGroup = bookingsGrouped.filter(booking => booking.group_number === groupNumber);

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
                bookings: bookingsInGroup,  // Các booking thuộc nhóm này
            };
        });

        let tourDb = await tourModel.findById(tour._id)
        dataRes.push({
            tour: tourDb,
            groups: result
        })
    }
    return dataRes
}

const updatePaymentInfo = async (params, data) => {
    const { transactionId } = data
    const id = params.id || null
    if (!id || !transactionId) {
        const error = new Error('The input in required!');
        error.status = 400
        throw error;
    }
    // check a valid id
    const validId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    if (!validId) {
        const error = new Error("Invalid ID format");
        error.status = 400
        throw error;
    }

    let bookingDb = await bookingModel.findOne({ _id: validId })

    if (!bookingDb) {
        const error = new Error('Booking not found');
        error.status = 404
        throw error;
    }
    //update info
    bookingDb.transactionId = transactionId
    bookingDb.payment_status = "payment_confirmed"
    let updated = await bookingDb.save()
    if (!updated) {
        const error = new Error("Somethings were wrong");
        error.status = 500
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
    const tour_guide_id = data.tour_guide_id
    const start_date = data.start_date
    const end_date = data.end_date
    const tour_id = data.tour_id
    const group_number = data.group_number

    if (!tour_guide_id ||
        !start_date ||
        !end_date ||
        !tour_id ||
        !group_number) {
        const error = new Error("The input is required");
        error.status = 400
        throw error;
    }

    try {
        const tourGuide = await userModel.findOne({ _id: tour_guide_id })
        if (!tourGuide) {
            const error = new Error("Tour guide is not found!");
            error.status = 404
            throw error;
        }
        // Lấy ra các thông tin khách hàng trong 1 đoàn để update tour_guide
        return await bookingModel.updateMany(
            {
                start_date,
                end_date,
                group_number,
                tour_id: tour_id
            },
            { tour_guide: tourGuide },
            { new: true }
        )
        // return await
    } catch (err) {
        throw err;
    }
}
module.exports = {
    createBooking,
    getBookDetail,
    updateBooking,
    getBookings,
    updatePaymentInfo,
    getMyBooking,
    getBookingsByGroup,
    assignmentGuideToBookings
}
