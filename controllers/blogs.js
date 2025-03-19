const router = require("express").Router();
const { Op } = require("sequelize");

const { tokenExtractor } = require("../util/middleware");
const { Blog, User } = require("../models");

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
    throw new Error("BlogNotFoundError");
  }

  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

module.exports = router;
