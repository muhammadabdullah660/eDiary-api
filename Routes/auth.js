const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../Models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const JWT_SECRET = "@bdisme";

//Create a user using : POST "/api/auth/createuser" No login required
router.post(
  "/createuser",
  [
    body("userName", "Enter a valid and unique name").isLength({ min: 3 }),
    body("email", "Enter a valid and unique email").isEmail(),
    body("password", "Length of password should be 8").isLength({ min: 8 }),
  ],
  async (req, res) => {
    // If there are error, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether email and userName exist already
      let user = await User.findOne({
        userName: req.body.userName,
        email: req.body.email,
      });
      //If user already exists throw an error
      if (user) {
        return res
          .status(400)
          .json({ errors: "Try a unique email and userName" });
      }
      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);
      //Create user
      user = await User.create({
        userName: req.body.userName,
        password: securePass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      console.log(token);
      //Send response
      // res.json(user);
      res.json({ token });
    } catch (error) {
      //Catch error if try block throws error and log the error
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Authenticate a user using : POST "/api/auth/login" No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid and unique email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    // If there are error, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credentials" });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
