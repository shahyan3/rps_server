const { Projects, sequelize } = require("../models/ProjectModel");

class ProjectService {
  static async getAllProjects() {
    const projects = await Projects.findAll();

    return projects;
  }

  static async saveProject(project) {
    // await sequelize.sync({ force: true }); // creates the Projects row (if doesn't exist in db)
    const projectBuilt = Projects.build({
      CompanyID: project.CompanyID,
      Name: project.Name,
      ContextID: project.ContextID,
      Latitude: project.Latitude,
      Longitude: project.Longitude,
      StateID: project.StateID,
      RegionID: project.RegionID,
      RadiusCovered: project.RadiusCovered,
      SubRegionID: project.SubRegionID,
      CommonWealth: project.CommonWealth
    });

    await projectBuilt.save();
    console.log("\n Project Saved to database!\n\n");

    return { project: projectBuilt };
  }
}

module.exports = ProjectService;
