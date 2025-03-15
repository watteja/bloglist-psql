const Blog = require("./blog");
const User = require("./user");

// Declare foreign key
User.hasMany(Blog);
Blog.belongsTo(User);

// Create schema if it doesn't exist
Blog.sync({ alter: true });
User.sync({ alter: true });

module.exports = {
  Blog,
  User,
};
