const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error });
  }
});

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(`Deleting blog ${JSON.stringify(req.blog, null, 2)}`);
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
