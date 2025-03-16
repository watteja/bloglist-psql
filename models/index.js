const Blog = require("./blog");
const User = require("./user");

// Declare foreign key
User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
};
