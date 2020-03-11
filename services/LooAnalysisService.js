const { LOO } = require("../models/LooAnalysisModel");
const ImpactIntensityService = require("../services/ImpactIntensityService");

const ConsolidatedListService = require("../services/ConsolidatedListService");
const BaseDataService = require("../services/BaseDataService");

// Figure out how to create foriegn key relations using sequilize and do queries to test
class LooAnalysisService {
  static async getConsolidatedSpecies(project_id, version_id) {
    let species;
    let data;
    let speciesList = [];
    try {
      // get consolidated list
      data = await ConsolidatedListService.getConsolidatedListByProjectVersionID(
        project_id,
        version_id
      );

      for (var i = 0; i < data.length; i++) {
        try {
          // search base data for species in consolidated list
          species = await BaseDataService.getSpeciesById(data[i].SpeciesID);

          speciesList.push(species);
        } catch (err) {
          throw err;
        }
      }
      // no species match base data that is in consolidated list
      if (speciesList.length <= 0) {
        throw new Error(
          "Error: No species could be retrieved. Hint: Version ID or Project ID could be invalid? Contact admin!"
        );
      } else {
        // return list of species found in consolidatesList -> (via speciesID's)
        return speciesList;
      }
    } catch (err) {
      throw err;
    }
  }

  static async saveLooAnalysis(looSpecies, projectID, versionID) {
    // console.log("save to loo....");
    try {
      for (var i = 0; i < looSpecies.length; i++) {
        // save project

        // if species is type "plant" then in Loo fauna field is "no"

        // if AtlasRecords (in ConsolidatedList) is greater than 5 - Recent field in Loo is "yes" true = 1, false = 0

        const looSpeciesBuilt = LOO.build({
          ProjectID: looSpecies[i].ProjectID,
          VersionID: looSpecies[i].VersionID,
          SpeciesID: looSpecies[i].SpeciesID,
          Lookup: looSpecies[i].Lookup,
          SurveyAdequacy: looSpecies[i].SurveyAdequacy,
          ImpactIntensity: looSpecies[i].ImpactIntensity
          // add fauna and recent fields from fronend is loo table? #todo
        });

        await looSpeciesBuilt.save();
      }

      console.log("\n Loo Analysis Species Saved to database Loo table!\n\n");

      // Initially, consolidated list is saved to impact intensity table, as soon as loo is created/saved.
      const list = await ConsolidatedListService.getConsolidatedListByProjectVersionID(
        projectID,
        versionID
      );

      // Save consolidated list to impact intensity (From consolidated list! as is in data schema!)
      try {
        await ImpactIntensityService.saveConsolidatedList(list);
      } catch (err) {
        return new Error(
          "Impact Intensity table values could not be created using consolidated list for this project. Contact admin!"
        );
      }

      return 0;
    } catch (err) {
      return err;
    }
  }
}

module.exports = LooAnalysisService;
