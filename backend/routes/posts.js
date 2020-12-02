const express = require("express");

const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("", checkAuth, PostController.getPosts);

router.get("/:id", checkAuth, PostController.getPost);

router.get("/download/:id", checkAuth,  PostController.dowloadFile);

router.delete("/:id", PostController.deletePost);


module.exports = router;
