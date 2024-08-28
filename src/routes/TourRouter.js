const express = require("express");
const router = express.Router();
const tourController = require('../controllers/TourController')
const {
    authUserMiddleWare,
    authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/', tourController.getAllTour)
router.get('/:id', tourController.getOneTour)
router.post('/', authMiddleWare, tourController.createTour)
router.put('/:id', authMiddleWare, tourController.updateOneTour)
router.delete('/:id', authMiddleWare, tourController.deleteOneTour)

module.exports = router;
