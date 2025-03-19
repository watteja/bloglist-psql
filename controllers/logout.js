const router = require("express").Router();

const { tokenExtractor } = require("../util/middleware");
const { Blog, User, Session } = require("../models");

router.delete("/", tokenExtractor, async (req, res) => {
  // remove all active sessions for the user
  await Session.destroy({ where: { userId: req.decodedToken.id } });
  res.status(204).end();
});

module.exports = router;
