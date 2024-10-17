const User = require("../models/UserModel");
const tourModel = require("../models/TourModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const bookingModel = require('../models/BookingModel');
const moment = require('moment')
moment.locale('vi')
const JwtService = require('../services/JwtService')
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
        reject({
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

const getAllUser = (query) => {
  return new Promise(async (resolve, reject) => {
    const name = query.name || null
    let filter = { role: { "$nin": ['admin'] } }

    if (name) {
      filter.name = {
        $regex: name, $options: 'i'
      }
    }
    try {
      const allUser = await User.find(filter);
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
const checkFreeScheduleUser = async (body) => {
  const { tourId } = body
  // const group_number = body.group_number
  const start_date = body.start_date
  const end_date = body.end_date

  if (!tourId ||
    !start_date ||
    !end_date
  ) {
    const error = new Error("The input is required");
    error.status = "ERROR";
    error.statusCode = 400
    throw error;
  }
  try {

    const sdate = moment(start_date)
    const edate = moment(end_date)

    //Lấy ra booking bị trùng trong khoản startDate và endDate
    const availableEmployees = await User.find({
      role: 'employee',
      _id: {
        $nin: await bookingModel.find({
          // Find tours that overlap with the given date range
          $or: [
            // Điều kiện 1: startDate nằm giữa start_date và end_date
            { start_date: { $lte: edate }, end_date: { $gte: sdate } },

            // Điều kiện 2: endDate nằm giữa start_date và end_date
            { start_date: { $lte: edate }, end_date: { $gte: sdate } },

            // Điều kiện 3: Khoảng thời gian của tour nằm hoàn toàn trong khoảng check
            { start_date: { $gte: sdate, $lte: edate }, end_date: { $gte: sdate, $lte: edate } }
          ]
        }).distinct('tour_guide') // Get list of guides who are assigned to overlapping tours
      }
    });
    return { availableEmployees, count: availableEmployees.length, sdate, edate }

  } catch (error) {
    const err = new Error()
    err.status = "ERROR"
    err.statusCode = 500
    err.message = error.message
    throw err
  }
}
const getGroupTourEmployeeLead = async (req, query) => {
  // Lấy id người dùng
  const sdate = query.start_date

  if (!sdate) {
    const error = new Error("Vui lòng chọn ngày khởi hành!");
    error.status = "ERROR";
    error.statusCode = 400
    throw error;
  }

  try {
    const token = req.headers?.token?.split("Bearer ")[1];
    const decoded = JwtService.getPayloadFromToken(token)
    let userId = decoded.id
    let role = decoded.role

    //Khi là admin thì cho xem lịch của tất cả nhân viên
    if (role === 'admin') {
      const bookingsGrouped = await bookingModel.aggregate([
        {
          $match: {
            start_date: new Date(sdate),
            tour_guide: {
              $ne: null
            } // So sánh start_date với ngày trong DB
          }
        },
        {
          $group: {
            _id: '$tour_guide', // Nhóm theo userId của tour guide
            bookings: { $push: '$$ROOT' } // Lưu danh sách các booking
          }
        },
        {
          $lookup: {
            from: 'users', // Tên collection chứa thông tin user
            localField: '_id', // _id trong bảng bookings là tour_guide (userId)
            foreignField: '_id', // _id trong bảng users
            as: 'guide_info' // Thông tin nhân viên sẽ được lưu trong guide_info
          }
        },
        {
          $unwind: '$guide_info' // Giải nén mảng guide_info để lấy chi tiết từng nhân viên
        },
        {
          $project: {
            userId: '$_id', // userId của tour guide
            name: '$guide_info.name', // Lấy tên của nhân viên
            email: '$guide_info.email', // Lấy email của nhân viên
            phone: '$guide_info.phone', // Lấy email của nhân viên
            role: '$guide_info.role', // Lấy email của nhân viên
            bookings: 1,    // Danh sách các booking của họ
            _id: 0           // Loại bỏ _id mặc định của MongoDB
          }
        }
      ]);
      return bookingsGrouped
    }
    //Tìm userid trong db
    return await bookingModel.find({
      tour_guide: userId,
      start_date: sdate
    })
  } catch (error) {
    const err = new Error()
    err.status = "ERROR"
    err.statusCode = 500
    err.message = error.message
    throw err
  }
}
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  deleteManyUser,
  updatePassword,
  checkFreeScheduleUser,
  getGroupTourEmployeeLead
};
