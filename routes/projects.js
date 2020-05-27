var express = require("express");
var router = express.Router();
var ProjectService = require("../services/ProjectService");
var VersionService = require("../services/VersionsService");

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

  let payload = [];

  try {
    // add version id for each project in the payload to client
    for (i = 0; i < projects.length; i++) {
      let proj = projects[i].dataValues;

      let version = await VersionService.getVersionByProjectId(proj.ID);

      if (version) {
        proj.version = version;

        payload.push(proj);
      }
    }

    if (payload.length > 0) {
      res.status(200).send({ all: payload });
      // res.json({ all: projects });
    }
  } catch (err) {
    res.status(404).send({ message: err.message });
  }

  // res.status(404).send({ message: "No projects found in database!" });
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
