const express = require("express");
const router = express.Router();
const userData = require("../MiddleWare/userData");
const Notes = require("../Models/Notes");
const { body, validationResult } = require("express-validator");

//Route 1: Getting all the notes : GET "/api/notes/fetchallnotes" login required
router.get("/fetchallnotes", userData, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    //Catch error if try block throws error and log the error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 2: Adding notes of a user : POST "/api/notes/addnote" login required
router.post(
  "/addnote",
  userData,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Length of description should be 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are error, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      //Catch error if try block throws error and log the error
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
