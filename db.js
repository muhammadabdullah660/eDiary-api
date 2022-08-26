const mongoose = require("mongoose");
const mongooseURI = "mongodb://localhost:27017/eDiary?";
const connectToMongo = () => {
  mongoose.connect(mongooseURI, () => {
    console.log("Connected");
  });
};

module.exports = connectToMongo;
