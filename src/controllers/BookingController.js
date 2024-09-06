const bookingService = require('../services/BookingService.js')
const createBooking = async (req, res, next) => {
    try {
        let createBooking = await bookingService.createBooking(req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: createBooking
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}
const getBookDetail = async (req, res, next) => {
    try {
        let book = await bookingService.getBookDetail(req.params)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: book
        })
    } catch (error) {
        next(error)
    }
}
const updateBooking = async (req, res, next) => {
    try {
        let rs = await bookingService.updateBooking(req.params, req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: rs
        })
    } catch (error) {
        console.log(error)

        next(error)
    }
}
const getBookings = async (req, res, next) => {
    try {
        let bookingResponse = await bookingService.getBookings(req.query)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            total: bookingResponse.total,
            currentPage: bookingResponse.currentPage,
            totalPage: bookingResponse.totalPage,
            sortBy: bookingResponse.sortBy,
            sort: bookingResponse.sort,
            limit: parseInt(bookingResponse.limit),
            countThisPage: bookingResponse.booking.length,
            data: bookingResponse.booking
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
const updatePaymentInfo = async (req, res, next) => {
    try {
        let paymentInfo = await bookingService.updatePaymentInfo(req.params, req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            data: paymentInfo
        })
    } catch (error) {
        console.log(error)

        next(error)
    }
}
const getMyBooking = async (req, res, next) => {
    try {
        const bookings = await bookingService.getMyBooking(req.query, req.body)
        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            total: bookings.total,
            currentPage: bookings.currentPage,
            totalPage: bookings.totalPage,
            sortBy: bookings.sortBy,
            sort: bookings.sort,
            limit: parseInt(bookings.limit),
            countThisPage: bookings.booking.length,
            data: bookings.booking
        })
    } catch (e) {
        console.error(e.message)
        next(e)
    }
}
module.exports = {
    createBooking,
    getBookDetail,
    updateBooking,
    getBookings,
    updatePaymentInfo,
    getMyBooking
}
