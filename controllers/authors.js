const router = require("express").Router();

const { Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", "id"), "articles"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    group: ["author"],
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
  });
  res.json(blogs);
});

module.exports = router;
