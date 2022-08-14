const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//Create a user using : POST "/api/auth"
router.post(
  "/",
  [
    body("userName", "Enter a valid and unique name").isLength({ min: 3 }),
    body("email", "Enter a valid and unique email").isEmail(),
    body("password", "Length of password should be 8").isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
    })
      .then((user) => res.json(user))
      .catch((err) => console.log(err));
    res.json({ error: "Please enter valid data", message: err.message });
  }
);
module.exports = router;
