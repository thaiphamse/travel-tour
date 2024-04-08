const OtpService = require("../services/OtpService");
const JwtService = require("../services/JwtService");

const createOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OtpService.createOtp(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OtpService.deleteOtp(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createOtp,
  deleteOtp,
};
