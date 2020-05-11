var express = require("express");
var router = express.Router();

var LooAnalysisService = require("../services/LooAnalysisService");
var ProjectService = require("../services/ProjectService");
var VersionsService = require("../services/VersionsService");

var { LOO, looSchema } = require("../models/LooAnalysisModel");

// #DEVELOPMENT TEST ROUTE
router.get("/", async (req, res, next) => {
  res.status(200).send("GET: Loo Analysis");
});

router.post("/", async (req, res, next) => {
  if (req.body) {
    if (req.body.projectID && req.body.versionID) {
      const versionID = req.body.versionID;
      const projectID = req.body.projectID;

      try {
        // find species in consolidated list table with the version and project id association
        const looSpeciesList = await LooAnalysisService.getConsolidatedSpecies(
          projectID,
          versionID
        );

        // #TODO like impact: save the initial loo list in loo after consolidated list
        // so that if consolidated list is updated I am NOT deleting all the values from LOO only the updated ones.!!!
        // return the looSpecies instead of baseData list in the  getConsolidatedSpecies() fix it.!!!
        // ########################
        res.status(200).send({ looSpeciesList: looSpeciesList });
      } catch (err) {
        // no species found with version project id
        res.status(400).send({ error: err.message });
      }
    }
  }
});

router.post("/saveLooAnalysis", async (req, res, next) => {
  if (req.body) {
    if (req.body.looSpecies && req.body.projectID && req.body.versionID) {
      let projectID = req.body.projectID;
      let versionID = req.body.versionID;
      // for loop to test all the species object fields are correct in array using JOI
      let looSpecies = req.body.looSpecies;

      const projectExist = await checkProjectExists(projectID);
      // check if project id given is matching and is in db
      if (projectExist == 1) {
        return res
          .status(400)
          .send({ error: "project with given id not found in database!" });
      }
      // check if version for project exists
      const versionExist = await checkVersionExists(projectID, versionID);
      if (versionExist == 1) {
        return res.status(400).send({
          error:
            "version id given is not found in database that matches the given project id!",
        });
      }

      // JOI validate and species object input tests
      for (var i = 0; i < looSpecies.length; i++) {
        // test 1) each species sent back has the correct project and version id
        if ((await checkProjectExists(looSpecies[i].ProjectID)) == 1) {
          return res.status(400).send({
            error: `Sent species with ID ${looSpecies[i].SpeciesID} has invalid project id ${looSpecies[i].ProjectID} (not found in db)`,
          });
        }

        if (
          (await checkVersionExists(projectID, looSpecies[i].VersionID)) == 1
        ) {
          return res.status(400).send({
            error: `Sent species with ID ${looSpecies[i].SpeciesID} has invalid version id ${looSpecies[i].VersionID} (not found in db)`,
          });
        }

        // #TODO DEFAULT: ImpactIntensity added ## do we need in LOO?
        looSpecies[i].ImpactIntensity = 5;
        // validate
        const { error } = looSchema.validate(looSpecies[i]);

        if (error) {
          return res.status(400).send({ error: error.message });
        }
      }

      try {
        // find species in consolidated list table with the version and project id association
        // returns 0 if successful
        const result = await LooAnalysisService.saveLooAnalysis(
          looSpecies,
          projectID,
          versionID
        );

        res
          .status(200)
          .send({ message: "Successfully saved species.", status: result });
      } catch (err) {
        console.log("failed to save%%%%");
        // no species found with given version id and project id
        res.status(400).send({ err: err.message });
      }
    }
  }
});

// check if version given is matching project id in db
async function checkVersionExists(projectID, versionID) {
  const version = await VersionsService.getVersionByProjectId(projectID);

  if (version == null || version.VersionID != versionID) {
    return 1;
  } else {
    return 0;
  }
}
// checks if project with id exists in db
async function checkProjectExists(projectID) {
  const project = await ProjectService.getProjectByID(projectID);

  if (project == null || project.ID != projectID) {
    return 1;
  } else {
    return 0;
  }
}
module.exports = router;
