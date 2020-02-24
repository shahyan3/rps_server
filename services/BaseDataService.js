const {
  BaseData,
  baseDataSchema,
  sequelize
} = require("../models/BaseDataModel");

class BaseDataService {
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
}

module.exports = BaseDataService;
