/*
  ProjectService class implements methods to interface with the Project table in the database
*/
const { Projects } = require("../models/ProjectModel");
const { Companies, sequelize } = require("../models/CompanyModel");
const VersionsService = require("./VersionsService");

class ProjectService {
  // Returns all projects in the Project table
  static async getAllProjects() {
    const projects = await Projects.findAll();

    return projects;
  }

  // Deletes all projects in the Project table
  static async deleteAllProjects() {
    return await Projects.destroy({
      where: {},
    });
  }

  // Given a Context text string returns the corresponding integer id for it
  static parseContextTEXT(text) {
    switch (text) {
      case "SSD Major Project":
        return 1;
      case "Part 4 Local Development":
        return 2;
      case "Part 5 Development":
        return 3;
      case "Mining SEPP":
        return 4;
      case "ISEPP 2007":
        return 5;
      case "SSI Major project":
        return 6;
      case "Complying Development":
        return 7;
      case "BDAR Waiver":
        return 8;
      case "CommonWealth":
        return 9;
    }
  }
  // Given a Region text string returns the corresponding integer id for it
  static parseRegionTEXT(text) {
    switch (text) {
      case "Australian Alps":
        return 1;
      case "Brigalow Belt South":
        return 2;
      case "Broken Hill Complex":
        return 3;
      case "Channel Country":
        return 4;
      case "Cobar Peneplain":
        return 5;
      case "Darling Riverine Plains":
        return 6;
      case "Mulga Lands":
        return 7;
      case "Murray Darling Depression":
        return 8;
      case "Mulga Lands":
        return 9;
      case "Nandewar":
        return 10;
      case "New England Tableland":
        return 11;
      case "North Coast":
        return 12;
      case "South Western Slopes":
        return 13;
      case "Riverina":
        return 14;
      case "Simpson-Strzelecki Dunefields":
        return 15;
      case "South East Corner":
        return 16;
      case "South Eastern Highlands":
        return 17;
      case "Sydney Basin":
        return 18;
    }

    return null;
  }

  // Given a Project table row id function returns project row from the Project table
  static async getProjectByID(id) {
    let project = await Projects.findOne({ where: { ID: id } });

    if (project) {
      let regionIDToText = this.parseRegionTEXT(project.Region);
      let contextIDToText = this.parseContextTEXT(project.Context);

      project.dataValues.Region = regionIDToText;
      project.dataValues.Context = contextIDToText;

      return project;
    }
  }

  // Given a RPS Project Id function returns project row from the Project table
  static async getProjectBy_RPSProjectID(rpsID) {
    let project = await Projects.findOne({ where: { RPSProjectID: rpsID } });
    return project;
  }

  // Given a Project name function returns project row from the Project table
  static async getProjectByName(name) {
    const project = await Projects.findOne({ where: { Name: name } });
    return project;
  }

  // Given a Context integer id returns the corresponding String text for it
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
  // Given a Region integer id returns the corresponding String text for it
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

  // Given a project object, Inserts into Project Table
  static async saveProject(project) {
    let versionBuilt;

    // checks if the project exists with given rps project if field
    let projectExist = await this.getProjectBy_RPSProjectID(
      project.RPSProjectID
    );
    /* 1) IF existing project is updated by user (update existing fields) in database */
    if (projectExist != null) {
      // check client's company exists in the db
      const company = await Companies.findOne({
        where: {
          Name: project.CompanyName,
        },
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
        where: {
          Name: project.CompanyName,
        },
      });

      // update existing project (BUT DON'T update the RPSProjectID)
      if (projectExist) {
        projectExist.update({
          Name: project.Name,
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

        var savedExistingProject = await projectExist.save();

        if (savedExistingProject) {
          console.log("\n Project Updated in database!\n\n");

          // get version for existing project
          let versionData = await VersionsService.getVersionByProjectId(
            projectExist.ID
          );

          // get updated project entry from database
          let updatedProjectEntry = await this.getProjectByID(projectExist.ID);
          // console.log("version data ===>", versionData.dataValues);

          return {
            // return existing version meta and project objects to client
            project: updatedProjectEntry,
            version: versionData,
          };
        }
      }
    } else {
      /* 2. Create a new project in database (since project doesn't exists) */
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

      if (savedProject) {
        versionBuilt = await VersionsService.saveVersion({
          ProjectID: projectBuilt.ID,
          LastEdited: new Date(),
          EditedBy: "John Doe", // #TODO when user system is implemented.
          Progress: "Incomplete",
          LastReviewed: new Date(),
          ReviewedBy: "Mark T",
          Created: new Date(),
          CreatedBy: "Joe Doe",
        });

        // get newly entry of version for existing project from database
        let versionData = await VersionsService.getVersionByProjectId(
          savedProject.ID
        );

        return {
          project: projectBuilt,
          version: versionData,
        };
      }
    }
  }
}

module.exports = ProjectService;
