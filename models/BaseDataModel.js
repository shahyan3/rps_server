const Joi = require("@hapi/joi");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("rps_2020_test", "root", "password", {
  dialect: "mysql",
  dialectOptions: {
    // Your mysql2 options here
  }
});

const BaseData = sequelize.define(
  "BaseData",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ScientificName: DataTypes.TEXT,
    CommonName: DataTypes.TEXT,
    TscAct: DataTypes.TEXT,
    EpbAct: DataTypes.TEXT,
    Habitat: DataTypes.TEXT,
    Type: DataTypes.TEXT,
    Family: DataTypes.TEXT
  },
  {
    tableName: "BaseData",
    timestamps: false
  }
);

// Joi Schema
const baseDataSchema = Joi.object({
  ScientificName: Joi.string().required(),
  CommonName: Joi.string().required(),
  TscAct: Joi.string().required(),
  EpbAct: Joi.string().required(),
  Habitat: Joi.string().required(),
  Type: Joi.string().required(),
  Family: Joi.string().required()
});

module.exports = {
  BaseData,
  sequelize,
  baseDataSchema
};
