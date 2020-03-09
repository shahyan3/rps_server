// const Joi = require("@hapi/joi");
// const { Sequelize, Model, DataTypes } = require("sequelize");

// const sequelize = new Sequelize("rps_2020_test", "root", "password", {
//   dialect: "mysql",
//   dialectOptions: {
//     // Your mysql2 options here
//   }
// });

// const OnlineData = sequelize.define(
//   "OnlineData",
//   {
//     ID: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     ScientificName: DataTypes.TEXT,
//     CommonName: DataTypes.TEXT,
//     TypeID: DataTypes.INTEGER,
//     FamilyID: DataTypes.INTEGER,
//     SAII: DataTypes.INTEGER
//   },
//   {
//     tableName: "OnlineData",
//     timestamps: false
//   }
// );

// // (async () => {
// //   await sequelize.sync({ force: true });
// //   // Code here
// // })();

// // Joi Schema
// const onlineDataSchema = Joi.object({
//   //   CompanyID: Joi.number().required(),
//   //   Name: Joi.string().required(),
//   //   ContextID: Joi.number().required(),
//   //   Latitude: Joi.number().required(),
//   //   Longitude: Joi.number().required(),
//   //   StateID: Joi.number().required(),
//   //   RegionID: Joi.number().required(),
//   //   RadiusCovered: Joi.number().required(),
//   //   Deadline: Joi.date().required(),
//   //   CommonWealth: Joi.number().required(),
//   //   ProjectStatus: Joi.string().required(),
//   //   ProjectSection: Joi.string().required()
// });

// module.exports = {
//   OnlineData,
//   sequelize,
//   onlineDataSchema
// };
