const express = require("express");
const router = express.Router();
const evaluateController = require("../controllers/EvaluateController");
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create/:id", evaluateController.createEvaluate);
router.get("/get-all-evaluate/:id", evaluateController.getAllEvaluateDetails);
router.delete(
  "/delete-evaluate/:id",
  authMiddleWare,
  evaluateController.deleteEvaluate
);
module.exports = router;
