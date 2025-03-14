const bcrypt = require("bcrypt");
const router = require("express").Router();

const { User } = require("../models");

// listing all users
router.get("/", async (_req, res) => {
  const users = await User.findAll();
  res.json(users);
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
  user.username = newUsername;
  await user.save();

  res.json(user); // status 200 is default
});

module.exports = router;
