const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post("/create-user", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", authUserMiddleWare, userController.logoutUser);
router.put("/update-user/:id", authUserMiddleWare, userController.updateUser);
router.put("/update-password", authUserMiddleWare, userController.updatePassword);
router.post("/refresh-token", userController.refreshToken);

router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/getAll", authMiddleWare, userController.getAllUser);
router.get("/get-detail", authUserMiddleWare, userController.getDetailUser);
router.post("/delete-many", authMiddleWare, userController.deleteMany);


module.exports = router;
