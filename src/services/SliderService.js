const Slider = require("../models/SliderModel");
const createSlider = (newSlider) => {
  return new Promise(async (resolve, reject) => {
    const { image, type } = newSlider;
    try {
      const checkImage = await Slider.findOne({
        image: image,
      });
      if (checkImage !== null) {
        resolve({
          status: "OK",
          message: "The image slider is already",
        });
      }

      const createSlider = await Slider.create({
        image,
        type,
      });
      if (createSlider) {
        resolve({
          status: "OK",
          message: "success",
          data: createSlider,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllSlider = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allSlider = await Slider.find();
      resolve({
        status: "OK",
        message: "success",
        data: allSlider,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteImageSlider = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkImage = await Slider.findOne({
        _id: id,
      });
      if (checkImage === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      await Slider.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailImage = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await Slider.findOne({
        _id: id,
      });
      if (image === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: image,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateSlider = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkImage = await Slider.findOne({
        _id: id,
      });
      if (checkImage === null) {
        resolve({
          status: "OK",
          message: "The image is not defined",
        });
      }
      const updateImage = await Slider.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "success",
        data: updateImage,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createSlider,
  getAllSlider,
  deleteImageSlider,
  getDetailImage,
  updateSlider,
};
