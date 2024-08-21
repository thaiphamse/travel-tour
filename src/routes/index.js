const userRouter = require("./UserRouter");
const placeRouter = require("./PlaceRouter");

const routes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/place", placeRouter);
};

module.exports = routes;
