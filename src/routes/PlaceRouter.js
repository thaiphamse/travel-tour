const express = require("express");
const router = express.Router();
const placeController = require('../controllers/PlaceController')
const {
  // authUserMiddleWare,
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/', placeController.getAllPlace)
router.get('/:id', placeController.getOnePlace)
router.post('/', authMiddleWare, placeController.createPlace)
router.put('/:id', authMiddleWare, placeController.updatePlace)
router.delete('/:id', authMiddleWare, placeController.deletePlace)

module.exports = router;
