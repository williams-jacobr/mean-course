const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const PostsController = require("../controllers/posts");

const router = express.Router();

router.post("", checkAuth, extractFile, PostsController.savePost);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
