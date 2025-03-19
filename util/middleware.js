const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { Session } = require("../models");

/** Extracts token from the request and verifies it */
const tokenExtractor = async (req, _res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);
    // console.log(token);
    // console.log(SECRET);
    req.decodedToken = jwt.verify(token, SECRET);

    // validate user session
    const session = await Session.findOne({
      where: { token, userId: req.decodedToken.id },
    });
    if (!session) {
      throw new Error("SessionError");
    }
  } else {
    throw new Error("MissingTokenError");
  }

  next();
};

module.exports = { tokenExtractor };
