const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("rps_2020", "root", "password", {
  dialect: "mysql",
  dialectOptions: {
    // Your mysql2 options here
  }
});

const Projects = sequelize.define(
  "Projects",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CompanyID: DataTypes.INTEGER,
    Name: DataTypes.TEXT,
    ContextID: DataTypes.TEXT,
    Latitude: DataTypes.INTEGER,
    Longitude: DataTypes.INTEGER,
    StateID: DataTypes.INTEGER,
    RegionID: DataTypes.INTEGER,
    RadiusCovered: DataTypes.INTEGER,
    SubRegionID: DataTypes.INTEGER,
    CommonWealth: DataTypes.INTEGER
  },
  {
    tableName: "Projects"
  }
);

// Joi Schema
const projectSchema = Joi.object({
  CompanyID: Joi.number().required(),
  Name: Joi.string().required(),
  ContextID: Joi.number().required(),
  Latitude: Joi.number().required(),
  Longitude: Joi.number().required(),
  StateID: Joi.number().required(),
  RegionID: Joi.number().required(),
  RadiusCovered: Joi.number().required(),
  SubRegionID: Joi.number().required(),
  CommonWealth: Joi.number().required()
});

module.exports = {
  Projects,
  sequelize,
  projectSchema
};
