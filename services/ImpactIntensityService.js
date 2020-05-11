const {
  ImpactIntensity,
  sequelize,
} = require("../models/ImpactIntensityModel");

const ConsolidatedListService = require("./ConsolidatedListService");

const NO = 0;
const POSSIBLE = 1;
const LIKELY = 2;

class ImpactIntensityService {
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

  static async getImpactIntensityByProjectVersionID(projectID, versionID) {
    const all = await ImpactIntensity.findAll({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
      },
    });
    return all;
  }

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
        console.log(
          "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
          significantImpact
        );

        if (significantImpact == null) {
          throw new Error(
            `ERR! Significant impact could not be counted from the answers given for ${speciesRow.SpeciesID}. Contact admin.`
          );
        }
        // fetch impactRow from table
        const impactRow = await ImpactIntensity.findOne({
          where: {
            ID: speciesRow.ID,
            SpeciesID: speciesRow.SpeciesID,
            ProjectID: projectID,
            VersionID: versionID,
          },
        });

        // check if returned successfully
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

  static async deleteList(projectID, versionID) {
    await ImpactIntensity.destroy({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
      },
    });
  }

  static async saveConsolidatedList(looSavedSpeciesList, projectID, versionID) {
    // save list to impact intensity table
    let savedImpactIntensity;
    let lookupScore;
    let impactPotentialFlag = false;

    // ###
    // update by deleting species previously saved in table (removes duplicate saved of same list)
    await ImpactIntensityService.deleteList(projectID, versionID);

    for (var i = 0; i < looSavedSpeciesList.length; i++) {
      let species = looSavedSpeciesList[i];
      let speciesID = species.SpeciesID;

      let speciesLookup = species.Lookup;
      let lowScore = 1; // look up score // make it a constant LOWSCORE and true false as YES and NO constants below.

      // update potential for impact
      // get lookup score of species, if <=1 potetial for impact flag is false
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
