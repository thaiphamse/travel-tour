const Evaluate = require("../models/EvaluateProduct");
// const bcrypt = require("bcrypt");
const EmailService = require("./EmailService");
const createEvaluate = (newEvaluate) => {
  return new Promise(async (resolve, reject) => {
    const { name, avatar, rating, description, user, product } = newEvaluate;
    try {
      const createEvaluate = await Evaluate.create({
        name,
        avatar,
        description,
        rating,
        user,
        product,
      });
      if (createEvaluate) {
        resolve({
          status: "OK",
          message: "success",
          data: createEvaluate,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllEvaluateDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const evaluate = await Evaluate.find({
        product: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (evaluate === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: evaluate,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteEvaluate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkEvaluate = await Evaluate.findOne({
        _id: id,
      });
      if (checkEvaluate === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await Evaluate.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createEvaluate,
  getAllEvaluateDetails,
  deleteEvaluate,
};
