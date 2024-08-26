const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleWare = (req, res, next) => {
  const token = req.headers?.token?.split("Bearer ")[1];
  console.log
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "the authentication",
        status: err,
      });
    }
    console.log(user)
    if (user?.role === 'admin') {
      next();
    } else {
      return res.status(404).json({
        message: "the authentication",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleWare = (req, res, next) => {
  //Cho user bình thường có thể xem được trang cá nhân của mình
  const token = req.headers?.token?.split("Bearer ")[1];
  const userId = req.params.id;

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "the authentication",
        status: err,
      });
    }
    // const { payload } = user;
    if (user?.role === 'admin' || user?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        message: "the authentication",
        status: "ERROR",
      });
    }
  });
};

module.exports = { authMiddleWare, authUserMiddleWare };
