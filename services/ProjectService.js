const { Projects, sequelize } = require("../models/ProjectModel");

const VersionsService = require("./VersionsService");

class ProjectService {
  static async getAllProjects() {
    const projects = await Projects.findAll();

    return projects;
  }

  static async deleteAllProjects() {
    return await Projects.destroy({
      where: {}
    });
  }

  static async getProjectByID(id) {
    const project = await Projects.findOne({ where: { ID: id } });
    return project;
  }

  static async getProjectByName(name) {
    const project = await Projects.findOne({ where: { Name: name } });
    return project;
  }
  static async saveProject(project) {
    let versionBuilt;

    let checkProject = await this.getProjectByName(project.Name);
    if (checkProject != null && checkProject.Name) {
      throw new Error("Error! Project with given name exists in database");
    }

    // save project
    const projectBuilt = Projects.build({
      CompanyID: project.CompanyID,
      Name: project.Name,
      ContextID: project.ContextID,
      Latitude: project.Latitude,
      Longitude: project.Longitude,
      StateID: project.StateID,
      RegionID: project.RegionID,
      RadiusCovered: project.RadiusCovered,
      Deadline: project.Deadline,
      CommonWealth: project.CommonWealth,
      ProjectStatus: project.ProjectStatus,
      ProjectSection: project.ProjectSection
    });

    let savedProject = await projectBuilt.save();
    console.log("\n Project Saved to database!\n\n");

    // create a version (meta-data) for the (comes from frontend later on?)
    const versionData = {
      ProjectID: projectBuilt.ID,
      LastEdited: new Date(),
      EditedBy: "John Doe", // #TODO when user system is implemented.
      Progress: "Incomplete",
      LastReviewed: new Date(),
      ReviewedBy: "Mark T",
      Created: new Date(),
      CreatedBy: "Joe Doe"
    };

    if (savedProject) {
      versionBuilt = await VersionsService.saveVersion(versionData);
    }

    return { project: projectBuilt, version: versionBuilt };
  }
}

module.exports = ProjectService;
