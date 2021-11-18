const Post = require("../models/post");

exports.savePost = (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId,
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "FAILED: Post not created",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get("host")}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount <= 0)
        return res
          .status(401)
          .json({ message: "User not authorized to update post" });

      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Post fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) res.status(404).json({ message: "Post not found!" });

      if (post) res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount <= 0)
        return res
          .status(401)
          .json({ message: "User not authorized to delete post" });

      res.status(200).json({ message: "Delete successful!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unable to delete post",
      });
    });
};
