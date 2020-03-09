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
    if (req.body.searchType === "name") {
      if (req.body.searchQuery) {
        query = req.body.searchQuery;
        try {
          species = await BaseDataService.getSpeciesByScientificName(query);
          res.status(200).send({ species: species });
        } catch (err) {
          res.status(400).send({ error: err.message });
        }
      }
    }
    // if req.body.searchType == "id"
  }
});

module.exports = router;
