const express = require("express");
const router = express.Router();
const blogController = require('../controllers/BlogController')
const {
  authMiddleWare,
} = require("../MiddleWare/authMiddleWare");

router.get('/', blogController.getAllBlog)
router.get('/:id', blogController.getOneBlog)
router.post('/', authMiddleWare, blogController.createBlog)
router.put('/:id', authMiddleWare, blogController.updateBlog)
router.delete('/:id', authMiddleWare, blogController.deleteBlog)

module.exports = router;
