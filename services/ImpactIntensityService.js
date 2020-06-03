/*
  ImpactIntensityService class implements methods to interface with the ImpactIntensity table in the database
*/

const {
  ImpactIntensity,
  sequelize,
} = require("../models/ImpactIntensityModel");

const ConsolidatedListService = require("./ConsolidatedListService");

const NO = 0;
const POSSIBLE = 1;
const LIKELY = 2;

class ImpactIntensityService {
  // Given a impact row (i.e. species) with scores for A1, A2, A3 etc, columns
  // this function returns the SignificantImpact Score of a given species
  static calculateSignificantImpact(species) {
    let significantImpact = null;
    let sumOfAnswers =
      species.A1 +
      species.A2 +
      species.A3 +
      species.A4 +
      species.A5 +
      species.A6 +
      species.A7 +
      species.A8;

    if (sumOfAnswers < 9) {
      significantImpact = NO;
    } else if (sumOfAnswers < 13) {
      significantImpact = POSSIBLE;
    } else if (sumOfAnswers >= 13) {
      significantImpact = LIKELY;
    }

    return significantImpact;
  }
  // Given a row id of a row in the ImpactIntensity table
  // returns that row  from the ImpactIntensity table in database.
  static async getImpactIntensityRow(rowID) {
    const row = await ImpactIntensity.findOne({
      where: { ID: rowID },
    });

    if (row != null) {
      return row;
    } else {
      throw new Error(
        `Impact Intensity row for the given row id ${rowID} not found in db`
      );
    }
  }

  // Given project and version id returns all the rows relating to these ids.
  static async getImpactIntensityByProjectVersionID(projectID, versionID) {
    const all = await ImpactIntensity.findAll({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
      },
    });
    return all;
  }

  // Returns impact intensity row given project and version id excluding the SignificantImpact column
  static async getImpactIntensityByIdExcludeSignificantImpact(
    projectID,
    versionID
  ) {
    const all = await ImpactIntensity.findAll({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
      },
      attributes: { exclude: ["updatedAt", "createdAt", "SignificantImpact"] },
    });
    return all;
  }

  // Given the version, project ids, and array of species list i.e. allSpeciesRows
  // this function selects rows in the ImpactIntensity table and updates the A1, A2, A3 etc.
  // scores given
  // @params version id
  // @params project id
  // @params allSpeciesRows (array of species objects with scores to be updated in table)
  // @returns returns all updates rows in ImpactIntesity table
  static async impactIntensityUpdateAnalysis(
    versionID,
    projectID,
    allSpeciesRows
  ) {
    // all the validations have been done in the router i.e. checking if allSpeciesRow data is correct e.g. ids etc.
    try {
      // calcualte significant impact, save to database, return all rows
      for (var i = 0; i < allSpeciesRows.length; i++) {
        let speciesRow = allSpeciesRows[i];
        // calculate significant impact value
        let significantImpact = this.calculateSignificantImpact(speciesRow);

        if (significantImpact == null) {
          throw new Error(
            `ERR! Significant impact could not be counted from the answers given for ${speciesRow.SpeciesID}. Contact admin.`
          );
        }
        // find row entry in table with given project, species, version and row ids
        // so answer scores can be updates i.e. A1, A2, A3 etc.
        const impactRow = await ImpactIntensity.findOne({
          where: {
            ID: speciesRow.ID,
            SpeciesID: speciesRow.SpeciesID,
            ProjectID: projectID,
            VersionID: versionID,
          },
        });

        // check if impact row exist in the table, update the row's Answers A1, A2 etc. scores
        if (impactRow) {
          impactRow.update({
            A1: speciesRow.A1,
            A2: speciesRow.A2,
            A3: speciesRow.A3,
            A4: speciesRow.A4,
            A5: speciesRow.A5,
            A6: speciesRow.A6,
            A7: speciesRow.A7,
            A8: speciesRow.A8,
            IndirectImpact: speciesRow.IndirectImpact,
            PotentialForImpact: speciesRow.PotentialForImpact,
            SignificantImpact: significantImpact,
          });

          await impactRow.save();
        }
      }

      // return updated impact row for the given version id, projectid
      const all = await this.getImpactIntensityByProjectVersionID(
        projectID,
        versionID
      );

      return all;
    } catch (err) {
      throw err;
    }
  }

  // given project id and version id delete all rows in ImpactIntensity table
  static async deleteList(projectID, versionID) {
    await ImpactIntensity.destroy({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
      },
    });
  }

  // Given array of species project id and version id this function saved Consolidated List (same as saved species in LOO table)
  // to the ImpactIntensity table with the initial scores get to NULL
  // @params project id
  // @params version id
  // @params looSavedSpeciesList (array of species to be saved in ImpactIntensity table)
  // @returns saved species in the ImpactIntensity table
  static async saveConsolidatedList(looSavedSpeciesList, projectID, versionID) {
    // save list to impact intensity table
    let savedImpactIntensity;
    let lookupScore;
    let impactPotentialFlag = false;

    // update by deleting species previously saved in table (removes duplicate saved of same list)
    await ImpactIntensityService.deleteList(projectID, versionID);

    for (var i = 0; i < looSavedSpeciesList.length; i++) {
      let species = looSavedSpeciesList[i];
      let speciesID = species.SpeciesID;

      let speciesLookup = species.Lookup;
      let lowScore = 1; // look up score // make it a constant LOWSCORE and true false as YES and NO constants below.

      // update potential for impact
      // get lookup score of species, if lookup score <=1 potetial for impact flag is false
      if (speciesLookup <= lowScore) {
        impactPotentialFlag = false;
      } else {
        // if lookup greater than 1 flag = true
        impactPotentialFlag = true;
      }

      // get SAII for species from consolidated list for a given project and version id!
      const { SAII } = await ConsolidatedListService.getSAIIForSpecies(
        speciesID,
        species.ProjectID,
        species.VersionID
      );
      // if saii is true, impact potential is true (even if lookup is <=1)
      if (SAII) {
        impactPotentialFlag = true;
      }

      // SAVE species to impact intensity with the potential for impact value
      const impactIntesitytBuilt = ImpactIntensity.build({
        ProjectID: species.ProjectID,
        VersionID: species.VersionID,
        SpeciesID: species.SpeciesID,
        PotentialForImpact: impactPotentialFlag,
      });

      savedImpactIntensity = await impactIntesitytBuilt.save();
    }

    console.log("\n Initial Impact Intesity saved to database!\n\n");

    return {
      data: savedImpactIntensity,
    };
  }
}

module.exports = ImpactIntensityService;
