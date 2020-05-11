var express = require("express");
var router = express.Router();

var ImpactIntensityService = require("../services/ImpactIntensityService");
var ProjectService = require("../services/ProjectService");
var VersionsService = require("../services/VersionsService");
var LooAnalysisService = require("../services/LooAnalysisService");
var BaseDataService = require("../services/BaseDataService");

var { impactIntensitySchema } = require("../models/ImpactIntensityModel");

// significant impact constants
const NO = 0;
const POSSIBLE = 1;
const LIKELY = 2;

// Send the impact intensity for the project and version given
router.post("/", async (req, res, next) => {
  if (req.body.data.projectID && req.body.data.versionID) {
    let projectID = req.body.data.projectID;
    let versionID = req.body.data.versionID;

    try {
      const getImpactIntesitySpecies = await ImpactIntensityService.getImpactIntensityByIdExcludeSignificantImpact(
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

// get report data from impact intensity for given project/version id
router.post("/report", async (req, res, next) => {
  if (req.body.projectID && req.body.versionID) {
    const projectID = req.body.projectID;
    const versionID = req.body.versionID;
    let reportData = [];
    try {
      // get the project
      let project = await ProjectService.getProjectByID(projectID);
      // get the loo

      let looList = await LooAnalysisService.getLooListByProjectVersionID(
        projectID,
        versionID
      );

      // get the impact
      let impactList = await ImpactIntensityService.getImpactIntensityByProjectVersionID(
        projectID,
        versionID
      );

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

      // for every impact row
      for (var i = 0; i < impactList.length; i++) {
        let speciesID = impactList[i].SpeciesID;

        console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSS speciedID", speciesID);
        // find species data in base data table
        let baseDataSpecies = await BaseDataService.getSpeciesById(speciesID);

        if (baseDataSpecies) {
          // create species object from one table row in report
          let scientificName = baseDataSpecies.ScientificName;
          let projectName = project.Name;
          let companyName = project.CompanyName;
          let context = project.Context;
          let deadline = project.Deadline;

          for (var j = 0; j < looList.length; j++) {
            console.log("$$$$$$$$$$$$$ lOO lOOP count =>>", j);
            if (looList[j].SpeciesID == impactList[i].SpeciesID) {
              const species = looList[j];
              const impactRow = impactList[i];

              console.log(
                "########################### Loo species == Impact species",
                species.SpeciesID,
                impactRow.SpeciesID
              );

              console.log(
                "===> MATCHED SPECIES loo and impact",
                species.dataValues,
                impactRow.dataValues
              );
              // get data from loo for match impact and loo table species
              let looLookupScore = species.Lookup;
              let looSurveyScore = species.SurveyAdequacy;

              // get data from impact row for matched impact and loo table species
              let indirectImpact, significantImpact, potentialForImpact;

              impactRow.IndirectImpact
                ? (indirectImpact = "Yes")
                : (indirectImpact = "No");

              if (impactRow.SignificantImpact) {
                if (impactRow.SignificantImpact == NO) {
                  significantImpact = "NO";
                }
                if (impactRow.SignificantImpact == POSSIBLE) {
                  significantImpact = "POSSIBLE";
                }

                if (impactRow.SignificantImpact == LIKELY) {
                  significantImpact = "LIKELY";
                }
              }

              // impactRow.SignificantImpact &&
              //   ? (significantImpact = "Yes")
              //   : (significantImpact = "No");

              impactRow.PotentialForImpact
                ? (potentialForImpact = "Yes")
                : (potentialForImpact = "No");

              var tableRow = {
                projectName,
                scientificName,
                companyName,
                context,
                deadline,
                looLookupScore,
                looSurveyScore,
                indirectImpact,
                significantImpact,
                potentialForImpact,
              };

              reportData.push(tableRow);
            }
          }
        }
      }

      console.log("+++++++++++++++++++>>>>>>>> ", reportData);

      res.status(200).send({
        reportData,
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
});

router.put("/update", async (req, res, next) => {
  console.log("=====>", req.body);
  if (req.body.projectInfo.projectID && req.body.projectInfo.versionID) {
    let projectID = req.body.projectInfo.projectID;
    let versionID = req.body.projectInfo.versionID;

    // check if the project and version details is correct
    try {
      const { ID } = await ProjectService.getProjectByID(projectID);
    } catch (err) {
      res.status(400).send({
        error: `Error:Given Project id ${projectID} in project info doesn't exist`,
        message: err.message,
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
          error: `Error:Given Version id ${versionID} in project info doesn't exist for project id ${projectID}`,
        });
        return;
      }
    } catch (err) {
      res.status(400).send({
        message: err.message,
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
            error: ` Error! For species with id ${impactRow.SpeciesID} given: ${error.message}`,
          });
        }

        // check from project given id exists
        const { ID } = ProjectService.getProjectByID(impactRow.ProjectID);

        if (ID) {
          res.status(400).send({
            error: `Error:Given Project id ${impactRow.projectID} for species with id ${impactRow.SpeciesID} doesn't exist`,
          });
          return;
        }

        // check from version with given id exists
        const { VersionID } = VersionsService.getVersionByProjectId(
          impactRow.ProjectID
        );

        if (VersionID) {
          res.status(400).send({
            error: `Error:Given Version id ${impactRow.VersionID} for species with id ${impactRow.SpeciesID} doesn't exist`,
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
              error: `Err: No row with species id ${impactRow.SpeciesID} exists for project id ${impactRow.ProjectID} and version id ${species.VersionID}  in Impact Intensity table.`,
            });
            return;
          }
        } catch (err) {
          console.log("------------------------------  from impact: ");
          // No row exists with given ID for impact intensity table
          console.log("===========", err.message);
          res.status(400).send({ error: err.message });
          return;
        }
      }
      console.log("+++++++++++++++++++++++++++++++++++  from impact: ");

      // update the impact intensity table for the given project, version id
      try {
        const updated_rows = await ImpactIntensityService.impactIntensityUpdateAnalysis(
          versionID,
          projectID,
          data
        );
        console.log(
          "################################################################ trying"
        );
        res.status(200).send({
          data: updated_rows,
          status: 0, // success
        });
      } catch (err) {
        console.log("## erorrrr", err.message);
        res.status(400).send({ error: err.message, status: 1 /* fail */ });
      }
    }
  }
});

module.exports = router;
