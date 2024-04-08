const express = require("express");
const router = express.Router();
const otpController = require("../controllers/OtpController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create", otpController.createOtp);
router.post("/delete-otp", otpController.deleteOtp);
module.exports = router;
