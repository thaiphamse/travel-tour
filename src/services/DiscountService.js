const Discount = require("../models/DiscountProduct");
const EmailService = require("./EmailService");
const createDiscount = (newDiscount) => {
  return new Promise(async (resolve, reject) => {
    const {
      product,
      value,
      startDiscount,
      endDiscount,
      followers,
      name,
      image,
    } = newDiscount;
    try {
      const checkDiscount = await Discount.findOne({
        product: product,
      });
      if (checkDiscount !== null) {
        resolve({
          status: "OK",
          message: "The image slider is already",
        });
      } else {
        const createDiscount = await Discount.create({
          product,
          value,
          startDiscount,
          endDiscount,
          followers,
          name,
          image,
        });
        if (createDiscount) {
          resolve({
            status: "OK",
            message: "success",
            data: createDiscount,
          });
          await EmailService.sendEmailDiscountProductToFollowers(newDiscount);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDiscount = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allDiscount = await Discount.find();
      resolve({
        status: "OK",
        message: "success",
        data: allDiscount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteDiscount = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkDiscount = await Discount.findOne({
        _id: id,
      });
      if (checkDiscount === null) {
        resolve({
          status: "OK",
          message: "The discount is not defined",
        });
      }
      await Discount.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete discount success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsDiscount = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({
        _id: id,
      });
      if (discount === null) {
        resolve({
          status: "OK",
          message: "The discount is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "success",
        data: discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateDiscount = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkDiscount = await Discount.findOne({
        _id: id,
      });
      if (checkDiscount === null) {
        resolve({
          status: "OK",
          message: "The discount is not defined",
        });
      }
      const updateDiscount = await Discount.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "success",
        data: updateDiscount,
      });
      if (updateDiscount) {
        await EmailService.sendEmailDiscountProductToFollowers(data);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyDiscount = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Discount.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Delete discount success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createDiscount,
  getAllDiscount,
  deleteDiscount,
  getDetailsDiscount,
  updateDiscount,
  deleteManyDiscount,
};
