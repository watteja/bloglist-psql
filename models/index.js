const Blog = require("./blog");

// Create schema if it doesn't exist
Blog.sync();

module.exports = {
  Blog,
};
