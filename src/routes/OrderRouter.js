const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create/:id", authUserMiddleWare, orderController.createOrder);
router.get("/get-order-details/:id", orderController.getOrderDetails);
router.get(
  "/get-all-order/:id",
  authUserMiddleWare,
  orderController.getAllOrderDetails
);
router.delete("/cancel-order/:id", orderController.cancelOrder);
router.get("/get-all-order", authMiddleWare, orderController.getAllOrder);
router.put(
  "/update-order/:id",
  authUserMiddleWare,
  orderController.updateOrder
);
module.exports = router;
