const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("rps_2020_test", "root", "password", {
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
    ContextID: DataTypes.INTEGER,
    Latitude: DataTypes.INTEGER,
    Longitude: DataTypes.INTEGER,
    StateID: DataTypes.INTEGER,
    RegionID: DataTypes.INTEGER,
    Deadline: DataTypes.DATE,
    RadiusCovered: DataTypes.INTEGER,
    CommonWealth: DataTypes.INTEGER
  },
  {
    tableName: "Projects"
  }
);

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

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
  Deadline: Joi.date().required(),
  CommonWealth: Joi.number().required()
});

module.exports = {
  Projects,
  sequelize,
  projectSchema
};
