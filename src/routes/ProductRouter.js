const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create", productController.createProduct);
router.put(
  "/update-product/:id",
  authMiddleWare,
  productController.updateProduct
);
router.get("/get-details/:id", productController.getDetailProduct);
router.delete(
  "/delete-product/:id",
  authMiddleWare,
  productController.deleteProduct
);
router.delete("/delete/:id", productController.deleteProduct);
router.get("/getAll", productController.getAllProduct);
router.get("/get-all-type", productController.getAllType);
router.post("/delete-many", authMiddleWare, productController.deleteMany);
router.put(
  "/addFollower/:id",
  authUserMiddleWare,
  productController.addFollower
);
router.delete(
  "/deleteFollower/:id",
  authUserMiddleWare,
  productController.deleteFollower
);
module.exports = router;
