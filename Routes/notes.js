const express = require("express");
const router = express.Router();
const userData = require("../MiddleWare/userData");
const Notes = require("../Models/Notes");

//Route 1: Getting all the notes : POST "/api/notes/fetchallnotes" login required
router.get("/fetchallnotes", userData, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});
module.exports = router;
