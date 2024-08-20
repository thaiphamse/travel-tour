const express = require("express");
const router = express.Router();
const discountController = require("../controllers/DiscountController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create", authMiddleWare, discountController.createDiscount);
router.get("/get-details-discount/:id", discountController.getDetailsDiscount);
router.delete(
  "/delete-discount/:id",
  authMiddleWare,
  discountController.deleteDiscount
);
router.get("/get-all-discount", discountController.getAllDiscount);
router.post("/delete-many-discount",  discountController.deleteManyDiscount);
router.put(
  "/update-discount/:id",
  authMiddleWare,
  discountController.updateDiscount
);

module.exports = router;
