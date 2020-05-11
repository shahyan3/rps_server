const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../config");

// const sequelize = new Sequelize("rps_2020_test", "root", "password", {
//   dialect: "mysql",
//   dialectOptions: {
//     // Your mysql2 options here
//   }
// });

const Projects = sequelize.define(
  "Projects",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    RPSProjectID: DataTypes.INTEGER,
    Name: DataTypes.TEXT,
    CompanyName: DataTypes.TEXT,
    Context: DataTypes.TEXT,
    Region: DataTypes.TEXT,
    CommonWealth: DataTypes.INTEGER,
    ProjectStatus: DataTypes.TEXT,
    Deadline: DataTypes.DATE,
    RadiusCovered: DataTypes.INTEGER,
    Latitude: DataTypes.TEXT,
    Longitude: DataTypes.TEXT,
  },
  {
    tableName: "Projects",
    timestamps: false,
  }
);

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// Joi Schema
const projectSchema = Joi.object({
  RPSProjectID: Joi.number().required(),
  Name: Joi.string().required(),
  CompanyName: Joi.string().required(),
  ContextID: Joi.number().required(),
  RegionID: Joi.number().required(),
  CommonWealth: Joi.number().required(),
  ProjectStatus: Joi.string().required(),
  Deadline: Joi.date().required(),
  RadiusCovered: Joi.number().required(),
  Latitude: Joi.string().required(),
  Longitude: Joi.string().required(),
  // StateID: Joi.number().required(),
  // ProjectSection: Joi.string().required(),
});

module.exports = {
  Projects,
  sequelize,
  projectSchema,
};
