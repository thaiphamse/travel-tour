const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create-user", authMiddleWare, userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", userController.updateUser);
router.put("/update-password", userController.updatePassword);
router.post("/refresh-token", userController.refreshToken);

router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/getAll", authMiddleWare, userController.getAllUser);
router.post("/list", authMiddleWare, userController.checkFreeScheduleUser);
router.get("/guide", authUserMiddleWare, userController.getGroupTourEmployeeLead);

router.get("/get-detail", userController.getDetailUser);
router.post("/delete-many", authMiddleWare, userController.deleteMany);

module.exports = router;
