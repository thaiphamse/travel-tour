const userRouter = require("./UserRouter");
const placeRouter = require("./PlaceRouter");
const foodRouter = require("./FoodRouter.js");
const tourRouter = require("./TourRouter.js")
const bookingRouter = require('./BookingRouter.js')
const commentRouter = require('./CommentRouter.js')
const categoryRouter = require('./CategoryRouter.js')
const routes = (app) => {
  app.use("/api/user", userRouter)
  app.use("/api/place", placeRouter)
  app.use("/api/food", foodRouter)
  app.use("/api/tour", tourRouter)
  app.use("/api/comment", commentRouter)
  app.use("/api/booking", bookingRouter)
  app.use("/api/category", categoryRouter)
};

module.exports = routes;
