var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var config = require("config");
var logger = require("morgan");

var database = require("./loaders/database"); /* Database depedency */

var indexRouter = require("./routes/index");
var projectsRouter = require("./routes/projects");
var speciesListRouter = require("./routes/speciesList");
var consolidatedListRouter = require("./routes/consolidatedList");
var looAnalysisRouter = require("./routes/looAnalysis");
var impactIntensityRouter = require("./routes/impactIntensity");
var authRouter = require("./routes/auth");
var adminProjects = require("./routes/admin/projects");
// var usersRouter = require("./routes/users");

var app = express();

/*
  JWT token:
  Block of code is commented out until authentication features implemented i.e. login/logout is implemented  
*/
// ensure the jwt key is set in the environment variable for the app.
// this key defined by environment variable brat_jwtPrivateKey is used in auth.js route jwt.sign(),
// to sign the jwt token against a "key" - created on the server side, checked below
// if (!config.get("jwtPrivateKey")) {
//   console.error("FATAL ERROR: jwtPrivateKey is not defined");
//   process.exit(1); // 0 is success, anthing is fail
// }

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/speciesList", speciesListRouter);
app.use("/api/consolidatedList", consolidatedListRouter);
app.use("/api/looAnalysis", looAnalysisRouter);
app.use("/api/impactIntensity", impactIntensityRouter);
app.use("/auth", authRouter);
app.use("/admin/projects", adminProjects);

console.log("====> new :]");

module.exports = app;
