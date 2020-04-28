const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../config");

// const sequelize = new Sequelize("rps_2020_test", "root", "password", {
//   dialect: "mysql",
//   dialectOptions: {
//     // Your mysql2 options here
//   }
// });

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

// Joi Schema

module.exports = {
  Companies,
  sequelize,
};
