const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
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
      //Create user
      user = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
      });
      //Send response
      res.json(user);
    } catch (error) {
      //Catch error if try block throws error and log the error
      console.error(error.message);
    }
  }
);
module.exports = router;
