const express = require("express");
const router = express.Router();
const foodController = require('../controllers/FoodController')
const {
    authUserMiddleWare,
    authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/:id', foodController.getOneFood)
router.get('/', foodController.getAllFood)

router.post('/', authMiddleWare, foodController.createFood)
router.put('/:id', authMiddleWare, foodController.updateFood)
router.delete('/:id', authMiddleWare, foodController.deleteFood)


module.exports = router;
