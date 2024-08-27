const express = require("express");
const router = express.Router();
const tourController = require('../controllers/TourController')
const {
    authUserMiddleWare,
    authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/', tourController.createTour)
// router.get('/:id', tourController)
router.post('/', authMiddleWare, tourController.createTour)
// router.put('/:id', authMiddleWare, tourController)
// router.delete('/:id', authMiddleWare, tourController)

module.exports = router;
