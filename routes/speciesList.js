var express = require("express");
var router = express.Router();
var BaseDataService = require("../services/BaseDataService");
// const { baseDataSchema } = require("../models/BaseDataModel");

// #DEVELOPMENT TEST ROUTE
router.get("/", async (req, res, next) => {
  res.status(200).send({ message: "GET: SpeciesList" });
});

router.post("/", async (req, res, next) => {
  let species;
  let query;

  if (req.body) {
    // validate request
    if (req.body.speciesID) {
      query = req.body.speciesID;
      try {
        species = await BaseDataService.getSpeciesById(query);
        res.status(200).send({ species: species });
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    }
  }
});

router.post("/all", async (req, res, next) => {
  try {
    const allSpecies = await BaseDataService.getAllSpecies();
    res.status(200).send(allSpecies);
  } catch (err) {
    res.status(400).send("Invalid request");
  }
});

module.exports = router;
