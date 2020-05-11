const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const { BaseData } = require("./BaseDataModel");
const { Versions } = require("./VersionsModel");

const sequelize = require("../config");

// const sequelize = new Sequelize("rps_2020_test", "root", "password", {
//   dialect: "mysql",
//   dialectOptions: {
//     // Your mysql2 options here
//   }
// });

const ConsolidatedList = sequelize.define(
  "ConsolidatedList",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ProjectID: DataTypes.INTEGER,
    VersionID: DataTypes.INTEGER,
    SpeciesID: DataTypes.INTEGER,
    EPBC: DataTypes.INTEGER,
    BAM: DataTypes.INTEGER,
    ATLAS: DataTypes.INTEGER,
    AtlasRecords: DataTypes.INTEGER,
    SAII: DataTypes.INTEGER,
  },
  {
    tableName: "ConsolidatedList",
  }
);

// Create foreign keys
ConsolidatedList.belongsTo(Versions, {
  onDelete: "cascade",
  foreignKey: "VersionID",
});

// Create foreign keys
ConsolidatedList.belongsTo(Versions, {
  onDelete: "cascade",
  foreignKey: "ProjectID", // make this fk in consolidated table that
  targetKey: "ProjectID", // ... referenced ProjectID in Versions table as "target key"
});

// Create foreign keys
ConsolidatedList.belongsTo(BaseData, {
  onDelete: "cascade",
  foreignKey: "SpeciesID", // make this fk in consolidated table
  targetKey: "ID", // make this fk in consolidated table
});

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// Joi Schema
const consolidatedListSchema = Joi.object({
  ProjectID: Joi.number().required(),
  // VersionID: Joi.number().required(),
  SpeciesID: Joi.number().required(),
  EPBC: Joi.number().integer().required().min(0).max(1),
  BAM: Joi.number().integer().required().min(0).max(1),
  ATLAS: Joi.number().integer().required().min(0).max(1),
  AtlasRecords: Joi.number().integer().required().min(0),
  SAII: Joi.number().integer().required().min(0).max(1),
  CandidateSpecies: Joi.number(), // not being used?
});

module.exports = {
  ConsolidatedList,
  sequelize,
  consolidatedListSchema,
};
