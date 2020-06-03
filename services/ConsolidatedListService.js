/*
  ConsolidatedListService class implements methods to interface with the ConsolidatedList table in the database
*/

const {
  ConsolidatedList,
  sequelize,
} = require("../models/ConsolidatedListModel");

const { Projects } = require("../models/ProjectModel");
const VersionsService = require("../services/VersionsService");
const BaseDataService = require("../services/BaseDataService");

class ConsolidatedListService {
  // given species id, project id and version id returns species from ConsolidatedList table
  static async getSAIIForSpecies(speciesID, projectID, versionID) {
    const species = await ConsolidatedList.findOne({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
        SpeciesID: speciesID,
      },
    });

    return species;
  }

  // given project and version id returns consolidated list of species
  static async getConsolidatedListByProjectVersionID(project_id, version_id) {
    const list = await ConsolidatedList.findAll({
      where: { ProjectID: project_id, VersionID: version_id },
    });
    return list;
  }

  // returns consolidated list of species rows the ConsolidatedList table and the project row from the Project table
  // that matches the species
  static async getListByProjectAssociation() {
    const list = await ConsolidatedList.findAll({
      attributes: ["ID", "ProjectID", "EPBC", "BAM", "ATLAS"],

      include: [
        {
          model: Projects,
          as: "Project",
          attributes: ["Name"],
        },
      ],
    });
    return list;
  }

  // given array of species and project id, INSERTS species into ConsolidatedList table as new entries
  // returns consolidated list of species from the table
  static async save(selectedSpecies, projectID) {
    // Get the "Version data" from Version table with reference to this project
    const versionData = await VersionsService.getVersionByProjectId(projectID);

    // save species to ConsolidatedList data table
    for (var i = 0; i < selectedSpecies.length; i++) {
      // search species in Base data model and check
      const species_selected = selectedSpecies[i];
      var baseDataSpecies;

      try {
        // check if selected species is found in base data
        baseDataSpecies = await BaseDataService.getSpeciesById(
          species_selected.SpeciesID
        );
      } catch (err) {
        // if species is not in base data table
        throw err;
      }

      // #TODO (for version 2 of application): delete all species one at a time from the records as they are updated.
      // the current implementation deletes all the rows in the ConsolidatedList table for a given project and version id
      // when it is updates
      await ConsolidatedListService.deleteOne(
        projectID,
        versionData.VersionID,
        species_selected.SpeciesID
      );

      // SPECIES FOUND IN BASE DATA at this point - save all the species in the ConsolidatedList into table
      const consolidatedList = ConsolidatedList.build({
        ProjectID: species_selected.ProjectID,
        VersionID: versionData.VersionID,
        SpeciesID: baseDataSpecies.ID,
        EPBC: species_selected.EPBC,
        BAM: species_selected.BAM,
        ATLAS: species_selected.ATLAS,
        AtlasRecords: species_selected.AtlasRecords,
        SAII: species_selected.SAII,
        // CandidateSpecies: onlineDataSpecies.CandidateSpecies
      });

      await consolidatedList.save();
      console.log("\n Consolidated list Saved to database!\n\n");
    }

    const consolidatedSpeciesList = await ConsolidatedListService.getConsolidatedListByProjectVersionID(
      projectID,
      versionData.VersionID
    );

    return consolidatedSpeciesList;
  }

  // deletes all species rows in the table where the project and version ids match
  static async deleteList(projectID, versionID) {
    await ConsolidatedList.destroy({
      where: { ProjectID: projectID, VersionID: versionID },
    });
  }
  // delete one species row in the table where the project, version id and species id match
  static async deleteOne(projectID, versionID, speciesID) {
    let flag = await ConsolidatedList.destroy({
      where: {
        ProjectID: projectID,
        VersionID: versionID,
        SpeciesID: speciesID,
      },
    });

    return flag;
  }
}

module.exports = ConsolidatedListService;
