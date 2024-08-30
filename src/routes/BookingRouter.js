const express = require("express");
const router = express.Router();
const bookingController = require('../controllers/BookingController')
const {
    authMiddleWare,
    authUserMiddleWare
} = require("../MiddleWare/authMiddleWare");

router.get('/:id', bookingController.getBookDetail)
// router.get('/', foodController.getAllFood)
router.post('/', authMiddleWare, bookingController.createBooking)
router.put('/:id', authMiddleWare, bookingController.updatePaymentInfo)
// router.delete('/:id', authMiddleWare, foodController.deleteFood)


module.exports = router;
