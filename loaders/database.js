const Sequelize = require("sequelize");
// const testDatabase = require("../config/test.json");

// Option 1: Passing parameters separately
const sequelize = new Sequelize("rps_2020_test", "root", "password", {
  host: "localhost",
  dialect: "mysql"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
