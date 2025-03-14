const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");

// parse incoming JSON data
app.use(express.json());

app.use("/api/blogs", blogsRouter);

const errorHandler = (error, _req, res, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.errors[0].message });
  } else if (error.message === "NotFoundError") {
    return res.status(404).json({ error: "Blog not found" });
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
