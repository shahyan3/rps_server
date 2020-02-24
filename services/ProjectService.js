const { Projects, sequelize } = require("../models/ProjectModel");

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

  static async getProjectByName(name) {
    const project = await Projects.findOne({ where: { Name: name } });
    return project;
  }

  static async saveProject(project) {
    let checkProject = await this.getProjectByName(project.Name);
    if (checkProject != null && checkProject.Name) {
      throw new Error("Error! Project with given name exists in database");
    }

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
      CommonWealth: project.CommonWealth
    });

    await projectBuilt.save();
    console.log("\n Project Saved to database!\n\n");

    return { project: projectBuilt };
  }
}

module.exports = ProjectService;
