const {
  ConsolidatedList,
  sequelize
} = require("../models/ConsolidatedListModel");

const { Projects } = require("../models/ProjectModel");

// const OnlineDataService = require("../services/OnlineDataService");
const VersionsService = require("../services/VersionsService");
const BaseDataService = require("../services/BaseDataService");

// Figure out how to create foriegn key relations using sequilize and do queries to test
class ConsolidatedListService {
  static async getConsolidatedListByProjectVersionID(project_id, version_id) {
    const list = await ConsolidatedList.findAll({
      where: { ProjectID: project_id, VersionID: version_id }
    });
    return list;
  }

  // not using atm.
  static async getListByProjectAssociation() {
    const list = await ConsolidatedList.findAll({
      attributes: ["ID", "ProjectID", "EPBC", "BAM", "ATLAS"],

      include: [
        {
          model: Projects,
          as: "Project",
          attributes: ["Name"]
        }
      ]
    });
    return list;
  }

  static async save(selectedSpecies, projectID) {
    console.log("in save function: project id>", projectID);
    // save data to conslidated list table
    console.log("what is send::::", selectedSpecies);

    // Get the "Version data" from Version table with reference to this project
    const versionData = await VersionsService.getVersionByProjectId(projectID);

    // save data to ConsolidatedList data table
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

      // SPECIES FOUND IN BASE DATA at this point - save all the species in the ConsolidatedList into table
      const consolidatedList = ConsolidatedList.build({
        ProjectID: species_selected.ProjectID,
        VersionID: versionData.VersionID,
        SpeciesID: baseDataSpecies.ID,
        EPBC: species_selected.EPBC,
        BAM: species_selected.BAM,
        ATLAS: species_selected.ATLAS,
        AtlasRecords: species_selected.AtlasRecords,
        SAII: species_selected.SAII
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
}

module.exports = ConsolidatedListService;
