var express = require("express");
var router = express.Router();
var ConsolidatedListService = require("../services/ConsolidatedListService");
var { consolidatedListSchema } = require("../models/ConsolidatedListModel");
// const { consolidatedList } = require("../models/ConsolidatedListModel");

var VersionsService = require("../services/VersionsService");

// #DEVELOPMENT TEST ROUTE
router.get("/", async (req, res, next) => {
  res.status(200).send({ message: "GET: Consolidated List" });
});

router.post("/", async (req, res, next) => {
  let species;
  let query;
  let versionID;
  if (req.body) {
    if (req.body.selectedSpecies && req.body.projectID) {
      const selectedSpecies = req.body.selectedSpecies;
      const projectID = req.body.projectID;

      // validate all fields wit JOI
      for (var i = 0; i < selectedSpecies.length; i++) {
        const { error } = consolidatedListSchema.validate(selectedSpecies[i]);

        if (error) {
          console.log("\n400 Bad Request: Some invalid species fields sent\n");
          res.status(400).send({ error: error.message });
        }
      }

      // check if all the species to be added have the same project id to ensure
      // we're adding fk reference to one and same project for all given species in request.
      for (var i = 0; i < selectedSpecies.length; i++) {
        if (selectedSpecies[i].ProjectID !== projectID) {
          res.status(400).send({
            error:
              "Error: ProjectID field for every species in the list must reference the same project."
          });

          return;
        }
      }

      try {
        const consolidatedList = await ConsolidatedListService.save(
          selectedSpecies,
          projectID
        );

        // not needed: was a test to see relations between tables working.
        // get all consolidated rows by project association  i.e. project with id 1
        // const list = await ConsolidatedListService.getListByProjectAssociation();

        // send the version id referencing project (prmeta) table data
        try {
          versionID = await VersionsService.getVersionByProjectId(projectID);
        } catch (err) {
          return { error: err.message };
        }

        res.status(200).send({
          projectInfo: { projectID: projectID, versionID: versionID.VersionID },
          consolidatedList
        });
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    }
  }
});

module.exports = router;
