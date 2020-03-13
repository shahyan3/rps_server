var express = require("express");
var router = express.Router();

var ImpactIntensityService = require("../services/ImpactIntensityService");
var ProjectService = require("../services/ProjectService");
var VersionsService = require("../services/VersionsService");

var { impactIntensitySchema } = require("../models/ImpactIntensityModel");

// Send the impact intensity for the project and version given
router.get("/", async (req, res, next) => {
  if (req.body.data.projectID && req.body.data.versionID) {
    let projectID = req.body.data.projectID;
    let versionID = req.body.data.versionID;

    try {
      const getImpactIntesitySpecies = await ImpactIntensityService.getImpactIntensityByProjectVersionID(
        projectID,
        versionID
      );
      res.status(200).send({ data: getImpactIntesitySpecies });
      return;
    } catch (err) {
      res
        .status(400)
        .send({ message: "ERROR! Invalid request not found in database" });
      return;
    }
  }
});

router.put("/update", async (req, res, next) => {
  if (req.body.projectInfo.projectID && req.body.projectInfo.versionID) {
    let projectID = req.body.projectInfo.projectID;
    let versionID = req.body.projectInfo.versionID;

    // check if the project and version details is correct
    try {
      const { ID } = await ProjectService.getProjectByID(projectID);
    } catch (err) {
      res.status(400).send({
        error: `Error:Given Project id ${projectID} in project info doesn't exist`,
        message: err.message
      });
      return;
    }

    try {
      // check from version with given id exists
      const { VersionID } = await VersionsService.getVersionByProjectId(
        projectID
      );

      if (versionID != VersionID) {
        res.status(400).send({
          error: `Error:Given Version id ${versionID} in project info doesn't exist for project id ${projectID}`
        });
        return;
      }
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
      return;
    }

    if (req.body.data) {
      var data = req.body.data;

      // for each given species in the list
      // joi scheme validate cleanse values
      for (var i = 0; i < data.length; i++) {
        var impactRow = data[i];

        const { error, value } = impactIntensitySchema.validate(impactRow);

        // joi validation for each species object in list given
        if (error) {
          return res.status(400).send({
            error: ` Error! For species with id ${impactRow.SpeciesID} given: ${error.message}`
          });
        }

        // check from project given id exists
        const { ID } = ProjectService.getProjectByID(impactRow.ProjectID);

        if (ID) {
          res.status(400).send({
            error: `Error:Given Project id ${impactRow.projectID} for species with id ${impactRow.SpeciesID} doesn't exist`
          });
          return;
        }

        // check from version with given id exists
        const { VersionID } = VersionsService.getVersionByProjectId(
          impactRow.ProjectID
        );

        if (VersionID) {
          res.status(400).send({
            error: `Error:Given Version id ${impactRow.VersionID} for species with id ${impactRow.SpeciesID} doesn't exist`
          });
          return;
        }

        // check if the impact intensity row for given species id both matches
        try {
          const row = await ImpactIntensityService.getImpactIntensityRow(
            impactRow.ID // this is: impact table row id not speciesID
          );

          // check if species id given matches species id in the table for the given row
          if (row.SpeciesID != impactRow.SpeciesID) {
            res.status(400).send({
              error: `Err: No row with species id ${impactRow.SpeciesID} exists for project id ${impactRow.ProjectID} and version id ${species.VersionID}  in Impact Intensity table.`
            });
            return;
          }
        } catch (err) {
          // No row exists with given ID for impact intensity table
          res.status(400).send({ error: err.message });
          return;
        }
      }

      // update the impact intensity table for the given project, version id
      try {
        const updated_rows = await ImpactIntensityService.impactIntensityUpdateAnalysis(
          versionID,
          projectID,
          data
        );

        res.status(200).send({
          data: updated_rows,
          status: 0 // success
        });
      } catch (err) {
        res.status(400).send({ error: err.message, status: 1 /* fail */ });
      }
    }
  }
});

module.exports = router;
