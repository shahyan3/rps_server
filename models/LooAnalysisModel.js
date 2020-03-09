const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const { Projects } = require("../models/ProjectModel");
const { Versions } = require("../models/VersionsModel");
const { ConsolidatedList } = require("../models/ConsolidatedListModel");

const sequelize = new Sequelize("rps_2020_test", "root", "password", {
  dialect: "mysql",
  dialectOptions: {
    // Your mysql2 options here
  }
});

const LOO = sequelize.define(
  "LOO",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ProjectID: DataTypes.INTEGER,
    VersionID: DataTypes.INTEGER,
    SpeciesID: DataTypes.INTEGER,
    Lookup: DataTypes.INTEGER,
    SurveyAdequacy: DataTypes.INTEGER,
    ImpactIntensity: DataTypes.INTEGER
  },
  {
    tableName: "LOO",
    timestamps: false
  }
);

// Create foreign keys
LOO.belongsTo(Projects, {
  onDelete: "cascade",
  foreignKey: "ProjectID",
  targetKey: "ID"
});

// Create foreign keys
LOO.belongsTo(Versions, {
  onDelete: "cascade",
  foreignKey: "VersionID",
  targetKey: "VersionID"
});

// Create foreign keys
LOO.belongsTo(ConsolidatedList, {
  onDelete: "cascade",
  foreignKey: "SpeciesID",
  targetKey: "SpeciesID"
});

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// Joi Schema
const looSchema = Joi.object({
  ProjectID: Joi.number().required(),
  VersionID: Joi.number().required(),
  SpeciesID: Joi.number().required(),
  Lookup: Joi.number()
    .min(0)
    .max(3)
    .required(),
  SurveyAdequacy: Joi.number()
    .min(0)
    .max(4)
    .required(),
  ImpactIntensity: Joi.number()
    .min(0)
    .max(6)
    .required()
});

module.exports = {
  LOO,
  sequelize,
  looSchema
};
