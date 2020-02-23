var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var logger = require("morgan");

var database = require("./loaders/database"); /* Database depedency */

var indexRouter = require("./routes/index");
var projectsRouter = require("./routes/projects");
var speciesListRouter = require("./routes/speciesList");
// var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/speciesList", speciesListRouter);
// app.use("/users", usersRouter);

// console.log("DATABASE: " + process.env.DB_NAME);

module.exports = app;
