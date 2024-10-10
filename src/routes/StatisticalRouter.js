const express = require("express");
const router = express.Router();
const statisticalController = require('../controllers/StatisticalController')
const {
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/', authMiddleWare, statisticalController.statistical)

module.exports = router;
