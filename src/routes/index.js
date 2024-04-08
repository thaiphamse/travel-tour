const userRouter = require("./UserRouter");
const productRouter = require("./ProductRouter");
const orderRouter = require("./OrderRouter");
const paymentRouter = require("./PaymentRouter");
const evaluateRouter = require("./EvaluateRouter");
const contactRouter = require("./ContactRouter");
const sliderRouter = require("./SliderRouter");
const otpRouter = require("./OtpRouter");
const postRouter = require("./PostRouter");
const commentRouter = require("./CommentRouter");
const discountRouter = require("./DiscountRouter");

const routes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/evaluate", evaluateRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/slider", sliderRouter);
  app.use("/api/otp", otpRouter);
  app.use("/api/post", postRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/discount", discountRouter);
};

module.exports = routes;
