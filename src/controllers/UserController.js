const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    else if (password?.length < 5) {
      return res.status(200).json({
        status: "ERR",
        message: "Mật khẩu ít nhất 5 kí tự",
      });
    }
    else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Email phải có dạng @gmail.com",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "Xác nhận mật khẩu và mật khẩu không trùng khớp",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }
    const response = await UserService.loginUser(req.body);
    // console.log(response)
    const { access_token, refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true, //thêm bảo mật phía client
      sameSite: "Lax",
      path: "/",
      domain: "localhost",
    });
    return res.status(200).json({ ...newResponse, access_token });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // res.removeHeader('token')
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: " OK",
      message: "Logout successfully",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);

  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteManyUser(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser(req.query);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const token = req.headers?.token?.split("Bearer ")[1];

    //get id from token
    const { id } = JwtService.getPayloadFromToken(token)
    const response = await UserService.getDetailUser(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers?.cookie?.split("=")[1];
    console.log(token)
    // const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "Not provide token",
      });
    }
    const response = await JwtService.refreshTokenService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await UserService.updatePassword(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const checkFreeScheduleUser = async (req, res, next) => {
  try {
    const response = await UserService.checkFreeScheduleUser(req.body);
    return res.status(200).json({
      status: "OK",
      message: "SUCCESS",
      data: response
    });
  } catch (error) {
    console.error(error)
    next(error)
  }
}
//Lấy lịch dẫn tour trong 1 ngày
const getGroupTourEmployeeLead = async (req, res, next) => {
  try {
    const response = await UserService.getGroupTourEmployeeLead(req, req.query);
    return res.status(200).json({
      status: "OK",
      message: "SUCCESS",
      data: response
    });
  } catch (error) {
    console.error(error)
    next(error)
  }
}
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
  logoutUser,
  deleteMany,
  updatePassword,
  checkFreeScheduleUser,
  getGroupTourEmployeeLead
};
