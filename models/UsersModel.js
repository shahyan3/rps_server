const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const { Roles } = require("./RolesModel");

const sequelize = require("../config");

const Users = sequelize.define(
  "Users",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Email: DataTypes.TEXT,
    FirstName: DataTypes.TEXT,
    LastName: DataTypes.TEXT,
    Password: DataTypes.TEXT,
    Password: DataTypes.TEXT,
    CompanyID: DataTypes.INTEGER,
    RoleID: DataTypes.INTEGER,
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

// Create foreign keys
Users.belongsTo(Roles, {
  onDelete: "cascade",
  foreignKey: "RoleID",
});

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

// Joi Schema
// const userSchema = Joi.object({
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
  Users,
  sequelize,
  //   userSchema,
};
