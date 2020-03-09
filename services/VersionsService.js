const { Versions, sequelize } = require("../models/VersionsModel");

class VersionsService {
  static async getAllVersions() {
    const versions = await Versions.findAll();

    return versions;
  }

  static async getVersionByProjectId(id) {
    const versionData = await Versions.findOne({ where: { ProjectID: id } });
    // console.log("hahaha", versionData);
    return versionData;
  }

  static async saveVersion(data) {
    // save to db
    const versionBuilt = Versions.build({
      ProjectID: data.ProjectID,
      LastEdited: data.LastEdited,
      EditedBy: data.EditedBy,
      Progress: data.Progress,
      LastReviewed: data.LastReviewed,
      ReviewedBy: data.ReviewedBy,
      Created: data.Created,
      CreatedBy: data.CreatedBy
    });

    await versionBuilt.save();
    console.log("\n Version Saved to database!\n\n");

    return { versionObject: versionBuilt };
  }
}

module.exports = VersionsService;
