var express = require("express");
var router = express.Router();

var { Companies } = require("../../models/CompanyModel");
var Projects = require("../../services/ProjectService");

/* GET home page. */
router.get("/", async (req, res, next) => {
  let masterList = [];

  // get projects from db
  const allProjects = await Projects.getAllProjects();

  for (var i = 0; i < allProjects.length; i++) {
    let project = allProjects[i];
    let company = await Companies.findOne({ where: { ID: project.CompanyID } });

    if (company) {
      masterList.push({
        projectID: project.ID,
        name: project.Name,
        client: company.Name,
        ecologistName: ["Jenny", ", Mark"],
      });
    }
  }

  res.status(200).send(masterList);
});

router.post("/", async (req, res, next) => {
  if (req.body.projectID) {
    // get projects from db
    const project = await Projects.getProjectByID(req.body.projectID);

    res.status(200).send(project);
  } else {
    res.status(400).send("Error: cannot find project with given id");
  }
});

module.exports = router;
