const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");
const password = "b1ZQ7KrwYKTYbWk1";

const app = express();

mongoose
  .connect(
    `mongodb+srv://Jacob:${password}@cluster0.iamly.mongodb.net/node-angular?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save();
  res.status(201).json({
    message: "Post added successfully!",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "fa29347fd8f",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "86df87sdyfsu",
      title: "Second server-side post",
      content: "This is coming from the server too :)",
    },
  ];
  res.status(200).json({
    message: "Post fetched successfully",
    posts: posts,
  });
});

module.exports = app;
