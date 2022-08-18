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

//Route 3: update note of a user : Put "/api/notes/updatenote" login required
router.put("/updatenote/:id", userData, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // Find the note and update it
    let note = await Notes.findById(req.params.id);
    //If note does not exists
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    //Catch error if try block throws error and log the error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 4: Delete note of a user : POST "/api/notes/updatenote" login required
router.delete("/deletenote/:id", userData, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Find the note and delete it
    let note = await Notes.findById(req.params.id);
    //If note does not exists
    if (!note) {
      return res.status(404).send("Not Found");
    }
    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    //Catch error if try block throws error and log the error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
