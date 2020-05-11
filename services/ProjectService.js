const { Projects } = require("../models/ProjectModel");
const { Companies, sequelize } = require("../models/CompanyModel");

const VersionsService = require("./VersionsService");

class ProjectService {
  static async getAllProjects() {
    const projects = await Projects.findAll();

    return projects;
  }

  static async deleteAllProjects() {
    return await Projects.destroy({
      where: {},
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

  static parseContextID(id) {
    switch (id) {
      case 1:
        return "SSD Major Project";
      case 2:
        return "Part 4 Local Development";
      case 3:
        return "Part 5 Development";
      case 4:
        return "Mining SEPP";
      case 5:
        return "ISEPP 2007";
      case 6:
        return "SSI Major project";
      case 7:
        return "Complying Development";
      case 8:
        return "BDAR Waiver";
      case 9:
        return "CommonWealth";
    }
  }

  static parseRegionID(id) {
    switch (id) {
      case 1:
        return "Australian Alps";
      case 2:
        return "Brigalow Belt South";
      case 3:
        return "Broken Hill Complex";
      case 4:
        return "Channel Country";
      case 5:
        return "Cobar Peneplain";
      case 6:
        return "Darling Riverine Plains";
      case 7:
        return "Mulga Lands";
      case 8:
        return "Murray Darling Depression";
      case 9:
        return "Mulga Lands";
      case 10:
        return "Nandewar";
      case 11:
        return "New England Tableland";
      case 12:
        return "North Coast";
      case 13:
        return "South Western Slopes";
      case 14:
        return "Riverina";
      case 15:
        return "Simpson-Strzelecki Dunefields";
      case 16:
        return "South East Corner";
      case 17:
        return "South Eastern Highlands";
      case 18:
        return "Sydney Basin";
    }
  }

  static async saveProject(project) {
    let versionBuilt;

    let checkProject = await this.getProjectByName(project.Name);
    if (checkProject != null && checkProject.Name) {
      throw new Error("Error! Project with given name exists in database");
    }

    // check client's company exists in the db
    const company = await Companies.findOne({
      where: { Name: project.CompanyName },
    });

    if (!company) {
      // client company doesn't exist - register it and create user for it
      const newCompanyBuilt = await Companies.build({
        Name: project.CompanyName,
      });
      await newCompanyBuilt.save();
    }

    // get company id from db
    const { ID } = await Companies.findOne({
      where: { Name: project.CompanyName },
    });

    // save project
    const projectBuilt = Projects.build({
      Name: project.Name,
      RPSProjectID: project.RPSProjectID,
      CompanyName: project.CompanyName,
      Context: this.parseContextID(project.ContextID),
      Region: this.parseRegionID(project.RegionID),
      CommonWealth: project.CommonWealth,
      ProjectStatus: project.ProjectStatus,
      Deadline: project.Deadline,
      RadiusCovered: project.RadiusCovered,
      Latitude: project.Latitude,
      Longitude: project.Longitude,
    });

    let savedProject = await projectBuilt.save();
    console.log("\n Project Saved to database!\n\n");

    // create a version (meta-data) for the (comes from frontend later on?) #TODO
    const versionData = {
      ProjectID: projectBuilt.ID,
      LastEdited: new Date(),
      EditedBy: "John Doe", // #TODO when user system is implemented.
      Progress: "Incomplete",
      LastReviewed: new Date(),
      ReviewedBy: "Mark T",
      Created: new Date(),
      CreatedBy: "Joe Doe",
    };

    if (savedProject) {
      versionBuilt = await VersionsService.saveVersion(versionData);
    }

    return { project: projectBuilt, version: versionBuilt };
  }
}

module.exports = ProjectService;
