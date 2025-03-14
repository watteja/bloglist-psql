const router = require("express").Router();

const { Blog } = require("../models");

router.get("/api/blogs", async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/api/blogs", async (req, res) => {
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

router.delete("/api/blogs/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(`Deleting blog ${JSON.stringify(req.blog, null, 2)}`);
    await req.blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
