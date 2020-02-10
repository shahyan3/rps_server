const Sequelize = require("sequelize");

// Option 1: Passing parameters separately
const sequelize = new Sequelize("rps_2020", "root", "password", {
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
