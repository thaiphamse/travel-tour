const userRouter = require("./UserRouter");
const productRouter = require("./ProductRouter");
const otpRouter = require("./OtpRouter");
const postRouter = require("./PostRouter");
const commentRouter = require("./CommentRouter");

const routes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/otp", otpRouter);
  app.use("/api/post", postRouter);
  app.use("/api/comment", commentRouter);
};

module.exports = routes;
