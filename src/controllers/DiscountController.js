const DiscountService = require("../services/DiscountService.js");
const JwtService = require("../services/JwtService");

const createDiscount = async (req, res) => {
  try {
    const { product, value, startDiscount, endDiscount } = req.body;
    if (!value || !startDiscount || !endDiscount || !product) {
      return res.status(404).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await DiscountService.createDiscount(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllDiscount = async (req, res) => {
  try {
    const response = await DiscountService.getAllDiscount();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteDiscount = async (req, res) => {
  try {
    const idDiscount = req.params.id;
    if (!idDiscount) {
      return res.status(200).json({
        status: "ERR",
        message: "The idDiscount is required",
      });
    }
    const response = await DiscountService.deleteDiscount(idDiscount);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsDiscount = async (req, res) => {
  try {
    const idDiscount = req.params.id;
    if (!idDiscount) {
      return res.status(200).json({
        status: "ERR",
        message: "The idDiscount is required",
      });
    }
    const response = await DiscountService.getDetailsDiscount(idDiscount);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    const data = req.body;
    if (!discountId) {
      return res.status(200).json({
        status: "ERR",
        message: "The discountId is required",
      });
    }
    const response = await DiscountService.updateDiscount(discountId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createDiscount,
  getAllDiscount,
  deleteDiscount,
  getDetailsDiscount,
  updateDiscount,
};
