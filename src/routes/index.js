const userRouter = require("./UserRouter");
const placeRouter = require("./PlaceRouter");
const foodRouter = require("./FoodRouter.js");


const routes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/place", placeRouter);
  app.use("/api/food", foodRouter);

};

module.exports = routes;
