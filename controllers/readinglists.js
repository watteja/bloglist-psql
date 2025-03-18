const router = require("express").Router();

const { ReadingLists } = require("../models");

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;
  const readingList = await ReadingLists.create({ userId, blogId });
  res.json(readingList);
});

module.exports = router;
