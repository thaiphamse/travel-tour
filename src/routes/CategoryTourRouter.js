const express = require("express");
const router = express.Router();
const categoryTourController = require("../controllers/CategoryTourController");

const {
    authMiddleWare,
    // authUserMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post('/', authMiddleWare, categoryTourController.createCategory)
router.delete('/:id', authMiddleWare, categoryTourController.deleteOneCategory)

router.put('/:id', categoryTourController.updateOneCategory)
router.get('/', categoryTourController.getAllCategory)
module.exports = router;
