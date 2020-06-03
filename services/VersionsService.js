/*
  VersionService class implements methods to interface with the Version table in the database
*/

const { Versions, sequelize } = require("../models/VersionsModel");

class VersionsService {
  // This func returns all entrys in the Version table
  static async getAllVersions() {
    const versions = await Versions.findAll();

    return versions;
  }
  // Given project id function returns version row
  static async getVersionByProjectId(id) {
    const versionData = await Versions.findOne({ where: { ProjectID: id } });
    return versionData;
  }

  // Given version object function inserts a new entry in the Version table
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
      CreatedBy: data.CreatedBy,
    });

    await versionBuilt.save();
    console.log("\n Version Saved to database!\n\n");

    return { versionObject: versionBuilt };
  }
}

module.exports = VersionsService;
