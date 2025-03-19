const router = require("express").Router();

const { tokenExtractor } = require("../util/middleware");
const { ReadingLists, User, Blog } = require("../models");

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;
  const readingList = await ReadingLists.create({ userId, blogId });
  res.json(readingList);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const readingList = await ReadingLists.findByPk(req.params.id);
  if (!readingList) {
    throw new Error("ReadingListNotFoundError");
  }
  const user = await User.findByPk(req.decodedToken.id);
  if (!user) {
    throw new Error("UserNotFoundError");
  }

  // user can only mark the blogs in their own reading list as read
  if (readingList.userId !== user.id) {
    throw new Error("UnauthorizedError");
  }
  readingList.read = req.body.read;
  await readingList.save();
  res.json(readingList);
});

module.exports = router;
