const {
  ImpactIntensity,
  sequelize
} = require("../models/ImpactIntensityModel");

const VersionsService = require("./VersionsService");

class ImpactIntensityService {
  static async getImpactIntensityByProjectVersionID(projectID, versionID) {
    const all = await ImpactIntensity.findAll({
      where: { ProjectID: projectID, VersionID: versionID }
    });
    return all;
  }

  static async deleteAllImpactIntensity() {
    return await ImpactIntensity.destroy({
      where: {}
    });
  }

  //   static async getImpactIntensityByID(id) {
  //     const project = await Projects.findOne({ where: { ID: id } });
  //     return project;
  //   }

  static async saveConsolidatedList(consolidated_list) {
    // save list to impact intensity table
    let savedImpactIntensity;
    let isTrue = true;

    for (var i = 0; i < consolidated_list.length; i++) {
      let species = consolidated_list[i];

      const impactIntesitytBuilt = ImpactIntensity.build({
        ProjectID: species.ProjectID,
        VersionID: species.VersionID,
        SpeciesID: species.SpeciesID,
        PotentialForImpact: isTrue
      });

      savedImpactIntensity = await impactIntesitytBuilt.save();
    }

    console.log(
      "\n Impact Intesity saved for consolidated list to database!\n\n"
    );

    return { data: savedImpactIntensity };
  }
}

module.exports = ImpactIntensityService;
