var express = require("express");
var router = express.Router();
var ConsolidatedListService = require("../services/ConsolidatedListService");
var BaseDataService = require("../services/BaseDataService");
var { consolidatedListSchema } = require("../models/ConsolidatedListModel");
// const { consolidatedList } = require("../models/ConsolidatedListModel");

var VersionsService = require("../services/VersionsService");

// #DEVELOPMENT TEST ROUTE
router.get("/", async (req, res, next) => {
  console.log("okiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  if (req.query.projectID && req.query.versionID) {
    const projectID = req.query.projectID;
    const versionID = req.query.versionID;

    console.log("params: ", projectID);
    console.log("params: ", versionID);

    // get consolidated species list
    let consolidatedList = await ConsolidatedListService.getConsolidatedListByProjectVersionID(
      projectID,
      versionID
    );

    for (var i = 0; i < consolidatedList.length; i++) {
      let speciesID = consolidatedList[i].SpeciesID;
      let species = await BaseDataService.getSpeciesById(speciesID);

      if (consolidatedList[i].SpeciesID == species.ID) {
        // console.log("species found ======>", species.ID);
        // add species scientific name to the consolidated list
        consolidatedList[i].dataValues.ScientificName = species.ScientificName;
      }
    }

    console.log("========>", consolidatedList.dataValues);
    res.status(200).send({ list: consolidatedList });
  } else {
    res.status(400).send("error: bad request");
  }
});

router.delete("/", async (req, res) => {
  console.log("delete...");
  if (req.query.projectID && req.query.versionID && req.query.speciesID) {
    let projectID = req.query.projectID;
    let versionID = req.query.versionID;
    let speciesID = req.query.speciesID;
    let deleteSpecies;

    console.log("project id", projectID);

    try {
      deleteSpecies = await ConsolidatedListService.deleteOne(
        projectID,
        versionID,
        speciesID
      );

      if (deleteSpecies) {
        res
          .status(200)
          .send(
            `Successfully deleted species id: ${speciesID} from project id: ${projectID} and version id: ${versionID}`
          );
      } else {
        res
          .status(400)
          .send("Bad request. Species not found. No changed happened in db..");
      }
    } catch (err) {
      res.status(400).send("Error something went wrong.", err.message);
    }
  }
});

router.post("/", async (req, res, next) => {
  let species;
  let query;
  let versionID;
  if (req.body) {
    if (req.body.selectedSpecies && req.body.projectID) {
      const selectedSpecies = req.body.selectedSpecies;
      console.log(">>>>>>> Consoldated list SENT: ", selectedSpecies);

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
              "Error: ProjectID field for every species in the list must reference the same project.",
          });

          return;
        }
      }

      // check if no duplicate species id sent by client
      var SpeciesID = selectedSpecies.map(function (item) {
        return item.SpeciesID;
      });

      var isDuplicate = SpeciesID.some(function (item, idx) {
        return SpeciesID.indexOf(item) != idx;
      });

      if (isDuplicate)
        return res
          .status(400)
          .send("Invalid list sent: duplicate species id not allowed");

      // save to db
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
          consolidatedList,
        });
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    }
  }
});

module.exports = router;
