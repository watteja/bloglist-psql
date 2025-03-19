const bcrypt = require("bcrypt");
const router = require("express").Router();

const { User, Blog } = require("../models");

// listing all users
router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

// displaying a single user
router.get("/:id", async (req, res) => {
  const readingListWhere = {};

  console.log("req.query.read", req.query.read);

  if (req.query.read === "true" || req.query.read === "false") {
    readingListWhere.read = req.query.read;
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ["name", "username"],
    include: {
      model: Blog,
      as: "readings",
      attributes: ["id", "url", "title", "author", "likes", "year"],
      // With 'attributes: []' we would specify that we don't want to include
      // any attributes from the join/connection table.
      through: { attributes: ["read", "id"], where: readingListWhere },
    },
  });

  res.json(user);
});

// adding a new user
router.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });

  res.json(user);
});

// changing the username
router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { newUsername } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  });
  if (!user) {
    throw new Error("UserNotFoundError");
  }
  user.username = newUsername;
  await user.save();

  res.json(user); // status 200 is default
});

module.exports = router;
