const express = require("express");
const router = express.Router();
const blogsController = require("../controllers/blogsController");

router
  .route("/")
  .get(blogsController.getAllBlogs)
  .post(blogsController.addBlog);

router
  .route("/:id")
  .get(blogsController.getBlog)
  .patch(blogsController.updateBlog)
  .delete(blogsController.deleteBlog);

module.exports = router;
