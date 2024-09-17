const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

const {
    authMiddleWare,
    // authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post('/', authMiddleWare, categoryController.createCategory)
router.delete('/:id', authMiddleWare, categoryController.deleteOneCategory)

router.put('/:id', categoryController.updateOneCategory)
router.get('/', categoryController.getAllCategory)
module.exports = router;
