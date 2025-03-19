const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const tokenExtractor = (req, _res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    console.log(authorization.substring(7));
    console.log(SECRET);
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
  } else {
    throw new Error("MissingTokenError");
  }

  next();
};

module.exports = { tokenExtractor };
