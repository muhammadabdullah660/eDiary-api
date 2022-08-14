const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//Create a user using : POST "/api/auth"
router.post("/", [], (req, res) => {
  body("userName").isLength({ min: 3 });
  body("email").isEmail();
  body("password").isLength({ min: 8 });
  console.log(req.body);
  const user = User(req.body);
  user.save();
  res.send("Hello!!");
});
module.exports = router;
