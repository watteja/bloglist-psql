const Blog = require("./blog");
const User = require("./user");

// Create schema if it doesn't exist
Blog.sync();
User.sync();

module.exports = {
  Blog,
  User,
};
