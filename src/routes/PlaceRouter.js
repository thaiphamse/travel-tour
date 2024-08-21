const express = require("express");
const router = express.Router();
const placeController = require('../controllers/PlaceController')
const {
  authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

module.exports = router;
