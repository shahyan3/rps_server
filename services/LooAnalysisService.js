const { LOO } = require("../models/LooAnalysisModel");

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

  static async saveLooAnalysis(looSpecies) {
    // console.log("save to loo....");
    try {
      for (var i = 0; i < looSpecies.length; i++) {
        // save project
        const looSpeciesBuilt = LOO.build({
          ProjectID: looSpecies[i].ProjectID,
          VersionID: looSpecies[i].VersionID,
          SpeciesID: looSpecies[i].SpeciesID,
          Lookup: looSpecies[i].Lookup,
          SurveyAdequacy: looSpecies[i].SurveyAdequacy,
          ImpactIntensity: looSpecies[i].ImpactIntensity
        });

        await looSpeciesBuilt.save();
      }

      console.log("\n Loo Analysis Species Saved to database Loo table!\n\n");
      return 0;
    } catch (err) {
      return err;
    }
  }
}

module.exports = LooAnalysisService;
