const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const readingListsRouter = require("./controllers/readinglists");
const logoutRouter = require("./controllers/logout");

// parse incoming JSON data
app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readingListsRouter);
app.use("/api/logout", logoutRouter);

const errorHandler = (error, _req, res, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.errors[0].message });
  } else if (error.message === "BlogNotFoundError") {
    return res.status(404).json({ error: "Blog not found" });
  } else if (error.message === "MissingTokenError") {
    return res.status(401).json({ error: "token missing" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (error.message === "UnauthorizedError") {
    return res.status(401).json({ error: "unauthorized" });
  } else if (error.message === "InvalidYearError") {
    return res.status(400).json({
      error: "Year must be a number between 1991 and the current year",
    });
  } else if (error.message === "UserNotFoundError") {
    return res.status(404).json({ error: "User not found" });
  } else if (error.message === "ReadingListNotFoundError") {
    return res.status(404).json({ error: "Reading list not found" });
  } else if (error.message === "SessionError") {
    return res.status(401).json({ error: "Not logged in" });
  }

  next(error);
};

// make sure to add this as the last middleware
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
