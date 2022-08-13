const mongoose = require("mongoose");
const mongooseURI = "mongodb://localhost:27017/";
const connectToMongo = () => {
  mongoose.connect(mongooseURI, () => {
    console.log("Connected");
  });
};

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello Abd!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = connectToMongo;
