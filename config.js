const { Sequelize, Model, DataTypes } = require("sequelize");

// // Production connects to rps_2020_test in VM?;
// var sequelize = new Sequelize("rps_2020_prd", "brat_adm", "VS4Z7usuHSLsv7Sg", {
//   host: "",
//   dialect: "mysql",
//   port: 3306,
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000,
//   },
// });

// Development;
var sequelize = new Sequelize("rps_2020_test", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

module.exports = sequelize;
