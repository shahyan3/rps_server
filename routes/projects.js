var express = require("express");
var router = express.Router();
var ProjectService = require("../services/ProjectService");
const { projectSchema } = require("../models/ProjectModel");

router.get("/project", async (req, res, next) => {
  console.log("++++++++++ query project id is ", req.query.projectId);
  if (req.query.projectId) {
    let id = req.query.projectId;
    const project = await ProjectService.getProjectByID(id);

    if (project) {
      console.log(project);
      res.status(200).send({ project });
    } else {
      res.status(404).send({ message: "No project found in database!" });
    }
  }
});

router.get("/", async (req, res, next) => {
  const projects = await ProjectService.getAllProjects();

  if (projects) {
    res.status(200).send({ all: projects });
    // res.json({ all: projects });
  } else {
    res.status(404).send({ message: "No projects found in database!" });
  }
});

router.post("/", async (req, res, next) => {
  if (req.body) {
    // validate request
    const { error, value } = projectSchema.validate(req.body);

    if (error) {
      console.log("\n400 Bad Request: Can't save project to db\n");
      res.status(400).send({ error: error.message });
    } else {
      try {
        const project = await ProjectService.saveProject(value);
        res.status(200).send(project);
      } catch (err) {
        console.log("Error given! ", err);
        res.status(400).send({ error: err.message });
      }
    }
  }
});

module.exports = router;
