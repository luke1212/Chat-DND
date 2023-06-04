
//MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const environment = require("./environment");
const mongoose = require("mongoose");

mongoose
  .connect(
    environment.mongoDB.MONGODB_URI
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

//API
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const User = require("./models/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  const user = new User({
    username: req.body.name,
    password: req.body.password
  })

  console.log(req.body);
  user.save().then(createdPost => {
    res.status(201).json({
      message: "Users added successfully",
      postId: createdPost._id
    });
  });
});

app.get("/api/users", (req, res, next) => {
  User.find().then(users => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      users: users
    });
  });
});

module.exports = app;