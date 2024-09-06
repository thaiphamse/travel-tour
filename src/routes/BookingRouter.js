const express = require("express");
const router = express.Router();
const bookingController = require('../controllers/BookingController')
const {
    authMiddleWare,
    authUserMiddleWare
} = require("../MiddleWare/authMiddleWare");

router.get("/my-booking", bookingController.getMyBooking);
router.get('/:id', bookingController.getBookDetail)
router.get('/', bookingController.getBookings)


router.put('/:id/paid', bookingController.updatePaymentInfo)

router.post('/', authMiddleWare, bookingController.createBooking)
router.put('/:id', authMiddleWare, bookingController.updateBooking)

// router.delete('/:id', authMiddleWare, foodController.deleteFood)


module.exports = router;
