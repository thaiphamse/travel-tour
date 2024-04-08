const SliderService = require("../services/SliderService.js");
const JwtService = require("../services/JwtService");

const createSlider = async (req, res) => {
  try {
    const { image, type } = req.body;
    console.log("Req body", req.body);

    if (!image || !type) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else {
      const response = await SliderService.createSlider(req.body);
      return res.status(200).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllSlider = async (req, res) => {
  try {
    const response = await SliderService.getAllSlider();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteImageSlider = async (req, res) => {
  try {
    const imageId = req.params.id;
    if (!imageId) {
      return res.status(200).json({
        status: "ERR",
        message: "The imageId is required",
      });
    }
    const response = await SliderService.deleteImageSlider(imageId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    if (!imageId) {
      return res.status(200).json({
        status: "ERR",
        message: "The imageId is required",
      });
    }
    const response = await SliderService.getDetailImage(imageId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateSlider = async (req, res) => {
  try {
    const imageId = req.params.id;
    const data = req.body;
    if (!imageId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await SliderService.updateSlider(imageId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createSlider,
  getAllSlider,
  deleteImageSlider,
  getDetailImage,
  updateSlider,
};
