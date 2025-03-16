const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");

router.get("/", async (req, res) => {
  let where = {};

  let keyword = req.query.search;
  if (keyword) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { author: { [Op.iLike]: `%${keyword}%` } },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
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
  // check that the year written is valid if present
  if (req.body.year) {
    if (
      isNaN(req.body.year) ||
      req.body.year < 1991 ||
      req.body.year > new Date().getFullYear()
    ) {
      throw new Error("InvalidYearError");
    }
  }

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
