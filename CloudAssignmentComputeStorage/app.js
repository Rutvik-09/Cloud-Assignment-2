const express = require("express");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const userRoute = require("./users");
// const rootRoute = "/api";

app.use(userRoute);

app.use("/", (req, res) => {
  res.send("It works!!");
});

module.exports = app;
