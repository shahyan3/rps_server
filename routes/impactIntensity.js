var express = require("express");
var router = express.Router();

var ImpactIntensityService = require("../services/ImpactIntensityService");
// const { consolidatedList } = require("../models/ConsolidatedListModel");

var VersionsService = require("../services/VersionsService");

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
    } catch (err) {
      res
        .status(400)
        .send({ message: "ERROR! Invalid request not found in database" });
    }
  }
});

router.post("/saveImpactIntensity", async (req, res, next) => {
  if (req.body) {
  }
});

module.exports = router;
