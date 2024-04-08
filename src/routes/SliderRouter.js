const express = require("express");
const router = express.Router();
const sliderController = require("../controllers/SliderController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create", authUserMiddleWare, sliderController.createSlider);
router.get("/get-details-image/:id", sliderController.getDetailImage);
router.delete(
  "/delete-image-slider/:id",
  authUserMiddleWare,
  sliderController.deleteImageSlider
);
router.get("/get-all-slider", sliderController.getAllSlider);
router.put("/update-image/:id", authMiddleWare, sliderController.updateSlider);

module.exports = router;
