const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const bookingModel = require('../models/BookingModel');
const { default: mongoose } = require("mongoose");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone, avatar } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "The email is already",
        });
      }
      if (!(password === confirmPassword)) {
        resolve({
          status: "ERR",
          message: "The password is not equal",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      const createUser = await User.create({
        name,
        email,
        password: hashPassword,
        confirmPassword: hashPassword,
        phone,
        avatar
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "success",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      }).select('+password');
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect ",
        });
      }

      const access_token = await genneralAccessToken({
        id: checkUser.id,
        role: checkUser.role,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        role: checkUser.role,
      });

      resolve({
        status: "OK",
        message: "success",
        access_token,
        refresh_token
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "error",
          message: "The user is not defined",
        });
      } else {
        const updateUser = await User.findByIdAndUpdate(id, data, {
          new: true,
        });

        resolve({
          status: "OK",
          message: "success",
          data: updateUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      } else {
        await User.findByIdAndDelete(id);

        resolve({
          status: "OK",
          message: "success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const checkUser = await User.findOne({
      //   _id: id,
      // });
      // if (checkUser === null) {
      //   resolve({
      //     status: "OK",
      //     message: "The user is not defined",
      //   });
      // }
      await User.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find().populate('tour');
      resolve({
        status: "OK",
        message: "success",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      })

      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updatePassword = (newPass) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = newPass;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (!checkUser) {
        resolve({
          status: "ERR",
          message: "The email is not find",
        });
        return;
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      checkUser.password = hashPassword;
      const updateUser = await checkUser.save();
      if (updateUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: [test],
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  deleteManyUser,
  updatePassword,
  // checkFreeScheduleUser
};
