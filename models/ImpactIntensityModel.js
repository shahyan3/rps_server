const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const { ConsolidatedList } = require("./ConsolidatedListModel");

const sequelize = require("../config");

// const sequelize = new Sequelize("rps_2020_test", "root", "password", {
//   dialect: "mysql",
//   dialectOptions: {
//     // Your mysql2 options here
//   }
// });

const ImpactIntensity = sequelize.define(
  "ImpactIntensity",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ProjectID: DataTypes.INTEGER,
    VersionID: DataTypes.INTEGER,
    SpeciesID: DataTypes.INTEGER,
    A1: DataTypes.INTEGER,
    A1: DataTypes.INTEGER,
    A2: DataTypes.INTEGER,
    A3: DataTypes.INTEGER,
    A4: DataTypes.INTEGER,
    A5: DataTypes.INTEGER,
    A6: DataTypes.INTEGER,
    A7: DataTypes.INTEGER,
    A8: DataTypes.INTEGER,
    IndirectImpact: DataTypes.BOOLEAN,
    SignificantImpact: DataTypes.INTEGER,
    PotentialForImpact: DataTypes.BOOLEAN
  },
  {
    tableName: "ImpactIntensity"
  }
);

// Create foreign keys
ImpactIntensity.belongsTo(ConsolidatedList, {
  onDelete: "cascade",
  foreignKey: "ProjectID",
  targetKey: "ProjectID"
});

// Create foreign keys
ImpactIntensity.belongsTo(ConsolidatedList, {
  onDelete: "cascade",
  foreignKey: "VersionID", // make this fk in impact table
  targetKey: "VersionID" // ... referenced VersionID in consolidated table the "target key"
});

// Create foreign keys
ImpactIntensity.belongsTo(ConsolidatedList, {
  onDelete: "cascade",
  foreignKey: "SpeciesID",
  targetKey: "SpeciesID"
});

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// Joi Schema
const impactIntensitySchema = Joi.object({
  ID: Joi.number().required(),
  ProjectID: Joi.number().required(),
  VersionID: Joi.number().required(),
  SpeciesID: Joi.number().required(),
  PotentialForImpact: Joi.boolean().required(),
  IndirectImpact: Joi.boolean().required(),
  A1: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required(),
  A2: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required(),
  A3: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required(),

  A4: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required(),
  A5: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required(),

  A6: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required(),
  A7: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required(),
  A8: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required()
});

module.exports = {
  ImpactIntensity,
  sequelize,
  impactIntensitySchema
};
