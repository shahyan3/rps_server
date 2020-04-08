const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../config");

const Roles = sequelize.define(
  "Roles",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: DataTypes.TEXT,
  },
  {
    tableName: "Roles",
    timestamps: false,
  }
);

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// Joi Schema
// const rolesSchema = Joi.object({
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
//   ProjectSection: Joi.string().required(),
// });

module.exports = {
  Roles,
  sequelize,
  //   userSchema,
};
