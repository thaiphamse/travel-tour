const express = require("express");
const router = express.Router();
const bookingController = require('../controllers/BookingController')
const {
    authMiddleWare,
    // authUserMiddleWare
} = require("../MiddleWare/authMiddleWare");


router.post('/', authMiddleWare, bookingController.createBooking)
router.post('/group/assignment', bookingController.assignmentTourGuide)

router.put('/:id/paid', bookingController.updatePaymentInfo)

router.put('/:id', authMiddleWare, bookingController.updateBooking)

router.get("/my-booking", bookingController.getMyBooking);
router.get('/groups', bookingController.getBookingsByGroup)
router.get('/:id', bookingController.getBookDetail)
router.get('/', bookingController.getBookings)
// router.delete('/:id', authMiddleWare, foodController.deleteFood)


module.exports = router;
