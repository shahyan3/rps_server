const {
  BaseData,
  baseDataSchema,
  sequelize
} = require("../models/BaseDataModel");

class BaseDataService {
  static async getAllSpecies() {
    const allSpecies = await BaseData.findAll();

    if (allSpecies != null) {
      return allSpecies;
    } else {
      throw new Error("Error: Species not found in base data!");
    }
  }
  static async getSpeciesByScientificName(name) {
    const species = await BaseData.findOne({
      where: { ScientificName: name }
    });

    if (species != null) {
      return species;
    } else {
      throw new Error("Error: Species not found in base data!");
    }
  }

  static async getSpeciesById(id) {
    const species = await BaseData.findOne({
      where: { ID: id }
    });

    if (species != null) {
      return species;
    } else {
      throw new Error("Error: Species not found in base data!");
    }
  }
}

module.exports = BaseDataService;
