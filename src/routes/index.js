const userRouter = require("./UserRouter");
const placeRouter = require("./PlaceRouter");
const blogRouter = require("./BlogRouter");
const foodRouter = require("./FoodRouter.js");
const tourRouter = require("./TourRouter.js")
const bookingRouter = require('./BookingRouter.js')
const commentRouter = require('./CommentRouter.js')
const categoryRouter = require('./CategoryRouter.js')
const categoryTourRouter = require('./CategoryTourRouter.js')
const routes = (app) => {
  app.use("/api/user", userRouter)
  app.use("/api/place", placeRouter)
  app.use("/api/blog", blogRouter)
  app.use("/api/food", foodRouter)
  app.use("/api/tour", tourRouter)
  app.use("/api/comment", commentRouter)
  app.use("/api/booking", bookingRouter)
  app.use("/api/category", categoryRouter)
  app.use("/api/category-tour", categoryTourRouter)
};

module.exports = routes;
