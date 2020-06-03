/*
  LooAnalysisService class implements methods to interface with the LOO table in the database
*/

const { LOO } = require("../models/LooAnalysisModel");
const ImpactIntensityService = require("../services/ImpactIntensityService");

const ConsolidatedListService = require("../services/ConsolidatedListService");
const BaseDataService = require("../services/BaseDataService");

class LooAnalysisService {
  // returns all the species list that is in a ConsolidatedList table for given project, version ids
  static async getConsolidatedSpecies(project_id, version_id) {
    let species;
    let data;
    let speciesList = [];
    try {
      //1. get consolidated list of species from given project, version id
      data = await ConsolidatedListService.getConsolidatedListByProjectVersionID(
        project_id,
        version_id
      );

      // #TODO in product version 2 - add species in loo and update those that doesn't exist in the table -- (ignore atm)
      for (var i = 0; i < data.length; i++) {
        try {
          // 2. search for species in BaseData table for matching species id in consolidated list
          species = await BaseDataService.getSpeciesById(data[i].SpeciesID);

          // 3. find species in LOO table (matching ConsolidatedList and BaseData table)
          let looSpecies = await LooAnalysisService.getSpeciesByProjectVersionID(
            project_id,
            version_id,
            species.ID
          );

          if (looSpecies != null) {
            // IF base data species exists in loo list of species - then species exist in loo table get its default scores
            if (species.ID == looSpecies.SpeciesID) {
              // add extra properties i.e. lookup and surveyscores to be displayed in LOO page as inital values
              species.dataValues.Lookup = looSpecies.Lookup;
              species.dataValues.SurveyAdequacy = looSpecies.SurveyAdequacy;
            }
          }

          speciesList.push(species);
        } catch (err) {
          console.log("ERROR", err.message);
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

  // Returns LOO rows of species given project id and version id
  static async getLooListByProjectVersionID(projectID, versionID) {
    const looSpecies = await LOO.findAll({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
      },
    });

    if (looSpecies != null) {
      return looSpecies;
    } else {
      return new Error(
        `lookup score could not be found from species with project id:${projectID}, speciesID: ${speciesID} and ${versionID}`
      );
    }
  }

  //  Delete Species in LOO entry given project, version and species id
  static async deleteOne(projectID, versionID, speciesID) {
    await LOO.destroy({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
        SpeciesID: speciesID,
      },
    });
  }

  // Returns single species in LOO table given project, version, species id
  static async getSpeciesByProjectVersionID(projectID, versionID, speciesID) {
    let species = await LOO.findOne({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
        SpeciesID: speciesID,
      },
    });

    return species;
  }

  // Given array of LOO entry rows (and correspoinding project and version ids)
  // saved the looSpecies in the LOO table
  static async saveLooAnalysis(looSpecies, projectID, versionID) {
    let looSavedSpecies;

    try {
      for (var i = 0; i < looSpecies.length; i++) {
        // update by deleting EACH species one at a time from the records as they are updated.
        await LooAnalysisService.deleteOne(
          projectID,
          versionID,
          looSpecies[i].SpeciesID
        );
        // insert LOO table entry
        const looSpeciesBuilt = LOO.build({
          ProjectID: looSpecies[i].ProjectID,
          VersionID: looSpecies[i].VersionID,
          SpeciesID: looSpecies[i].SpeciesID,
          Lookup: looSpecies[i].Lookup,
          SurveyAdequacy: looSpecies[i].SurveyAdequacy,
          ImpactIntensity: looSpecies[i].ImpactIntensity,
          // add fauna and recent fields from fronend is loo table? #todo
        });

        await looSpeciesBuilt.save();
      }

      console.log("\n Loo Analysis Species Saved to database Loo table!\n\n");

      // get saved loo species
      looSavedSpecies = await this.getLooListByProjectVersionID(
        projectID,
        versionID
      );

      // Save LOO species to impact intensity (that exist in LOO table) from given project, version ids
      // ImpactIntensity rows answer score fields  i.e. A1, A2, etc. are set to NULL
      // until there are given in the ImpactIntensity page
      try {
        await ImpactIntensityService.saveConsolidatedList(
          looSavedSpecies,
          projectID,
          versionID
        );
        console.log("Save initial loo species to impact intensity");
      } catch (err) {
        return new Error(
          "Impact Intensity table values could not be created using loo species for this project. Contact admin!"
        );
      }

      return 0;
    } catch (err) {
      return err;
    }
  }
}

module.exports = LooAnalysisService;
