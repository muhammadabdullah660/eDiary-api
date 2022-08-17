var jwt = require("jsonwebtoken");
const JWT_SECRET = "@bdisme";
//create middleware function
const userData = (req, res, next) => {
  //Get the user from jwt token and add id to req object
  const token = req.header("authToken");
  if (!token) {
    return res.status(401).send({ error: "Please login using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Please login using a valid token" });
  }
};
module.exports = userData;
