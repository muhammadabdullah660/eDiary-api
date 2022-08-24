const mongoose = require("mongoose");
const mongooseURI = process.env.MONGOURI;
const connectToMongo = () => {
  mongoose.connect(mongooseURI, () => {
    console.log("Connected");
  });
};

module.exports = connectToMongo;
