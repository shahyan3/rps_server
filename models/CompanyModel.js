const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../config");

const Companies = sequelize.define(
  "Companies",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: DataTypes.TEXT,
  },
  {
    tableName: "Companies",
    timestamps: false,
  }
);

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();

module.exports = {
  Companies,
  sequelize,
};
