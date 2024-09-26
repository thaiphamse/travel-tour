const express = require("express");
const router = express.Router();
const tourController = require('../controllers/TourController')
const {
    // authUserMiddleWare,
    authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post('/', authMiddleWare, tourController.createTour)
router.put('/:id', authMiddleWare, tourController.updateOneTour)
router.delete('/:id', authMiddleWare, tourController.deleteOneTour)
router.get('/main', tourController.getFiveMainTour)
router.get('/:id', tourController.getOneTour)
router.get('/', tourController.getAllTour)
module.exports = router;
