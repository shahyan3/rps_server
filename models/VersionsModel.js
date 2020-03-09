const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const { Projects } = require("../models/ProjectModel");

const sequelize = new Sequelize("rps_2020_test", "root", "password", {
  dialect: "mysql",
  dialectOptions: {
    // Your mysql2 options here
  }
});

const Versions = sequelize.define(
  "Versions",
  {
    VersionID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ProjectID: DataTypes.INTEGER,
    LastEdited: DataTypes.DATE,
    EditedBy: DataTypes.TEXT,
    Progress: DataTypes.TEXT,
    LastReviewed: DataTypes.DATE,
    ReviewedBy: DataTypes.TEXT,
    Created: DataTypes.DATE,
    CreatedBy: DataTypes.TEXT
  },
  {
    tableName: "Versions",
    timestamps: false
  }
);

// create one to many associations - one project may have many versions (meta edits) ??
// Projects.hasMany(Versions);

// Create foreign keys
Versions.belongsTo(Projects, {
  onDelete: "cascade",
  foreignKey: "ProjectID"
});

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// Joi Schema
const versionSchema = Joi.object({
  //   CompanyID: Joi.number().required(),
  //   Name: Joi.string().required(),
  //   ContextID: Joi.number().required(),
  //   Latitude: Joi.number().required(),
  //   Longitude: Joi.number().required(),
  //   StateID: Joi.number().required(),
  //   RegionID: Joi.number().required(),
  //   RadiusCovered: Joi.number().required(),
  //   Deadline: Joi.date().required(),
  //   CommonWealth: Joi.number().required(),
  //   ProjectStatus: Joi.string().required(),
  //   ProjectSection: Joi.string().required()
});

module.exports = {
  Versions,
  sequelize,
  versionSchema
};
