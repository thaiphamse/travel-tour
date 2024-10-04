const express = require("express");
const router = express.Router();
const blogController = require('../controllers/BlogController')
const {
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.post('/', authMiddleWare, blogController.createBlog)
router.put('/:id', authMiddleWare, blogController.updateBlog)
router.delete('/:id', authMiddleWare, blogController.deleteBlog)
router.get('/:id', blogController.getOneBlog)
router.get('/', blogController.getAllBlog)

module.exports = router;
