const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  obj = {
    a: "dadccc",
    number: 1332,
  };
  res.json(obj);
});
module.exports = router;
