const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
var config = require("config");

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

// attach a method to user schema object's methods
// JWT - generate token with payload  {their info } sent to the authenticated client
// token generated against a private key used to uncode token i.e. payload data
// the token is generate against the private key defined by in the environment variable when
// server is startup - config.get grabs the key from environment variable (check app.js line 21)
generateAuthToken = function (userRole) {
  const token = jwt.sign(
    { id: this.ID, firstName: this.FirstName, role: userRole },
    config.get("jwtPrivateKey")
  );

  return token;
};

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
  // generateAuthToken,
  //   userSchema,
};
