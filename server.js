const express = require("express");
require("express-async-errors");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const userRouter = require("./routes/userRouter");
const jobsRouter = require("./routes/jobsRouter");
const db = require("./db/jobAppDB");
const app = express();

//app functionalities
app.use("/user", userRouter);
app.use("/jobs", jobsRouter);

//errors
app.use(notFound);
app.use(errorHandler);

//start the app
async function start() {
  try {
    await db.sync({ alter: true });
    app.listen(3000);
  } catch (error) {
    console.error(error);
  }
}

start();
