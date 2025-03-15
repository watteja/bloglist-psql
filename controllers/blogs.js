const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  res.json(blogs);
});

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

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.delete("/:id", [blogFinder, tokenExtractor], async (req, res) => {
  if (req.blog) {
    const user = await User.findByPk(req.decodedToken.id);
    if (req.blog.userId !== user.id) {
      throw new Error("UnauthorizedError");
    }
    console.log(`Deleting blog ${JSON.stringify(req.blog, null, 2)}`);
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  if (!req.blog) {
    throw new Error("NotFoundError");
  }

  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

module.exports = router;
