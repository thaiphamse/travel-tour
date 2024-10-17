const express = require("express");
const router = express.Router();
const bookingController = require('../controllers/BookingController')
const {
    authMiddleWare,
    // authUserMiddleWare
} = require("../MiddleWare/authMiddleWare");


router.post('/', bookingController.createBooking)
router.post('/group/assignment', authMiddleWare, bookingController.assignmentTourGuide)

router.put('/:id/paid', bookingController.updatePaymentInfo)

router.put('/:id', bookingController.updateBooking)

router.get("/my-booking", bookingController.getMyBooking);
router.get('/groups', authMiddleWare, bookingController.getBookingsByGroup)
router.get('/:id', authMiddleWare, bookingController.getBookDetail)
router.get('/', authMiddleWare, bookingController.getBookings)
// router.delete('/:id', authMiddleWare, foodController.deleteFood)


module.exports = router;
