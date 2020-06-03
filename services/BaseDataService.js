/*
  BaseDataService class implements methods to interface with the BaseData table in the database
*/
const {
  BaseData,
  baseDataSchema,
  sequelize,
} = require("../models/BaseDataModel");

class BaseDataService {
  // returns all the species in base data table
  static async getAllSpecies() {
    const allSpecies = await BaseData.findAll();

    if (allSpecies != null) {
      return allSpecies;
    } else {
      throw new Error("Error: Species not found in base data!");
    }
  }
  // given species scientific name returns species row from base data table
  static async getSpeciesByScientificName(name) {
    const species = await BaseData.findOne({
      where: { ScientificName: name },
    });

    if (species != null) {
      return species;
    } else {
      throw new Error("Error: Species not found in base data!");
    }
  }

  // given species row id returns matched row id entry from base data table
  static async getSpeciesById(id) {
    const species = await BaseData.findOne({
      where: { ID: id },
    });

    if (species != null) {
      return species;
    } else {
      throw new Error("Error: Species not found in base data!");
    }
  }
}

module.exports = BaseDataService;
