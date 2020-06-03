/*
    Unused class so far.
*/

// const { OnlineData, sequelize } = require("../models/OnlineDataModel");

// class OnlineDataService {
//   //   static async getAllVersions() {
//   //     const versions = await Versions.findAll();

//   //     return versions;
//   //   }

//   //   static async getVersionByProjectId(id) {
//   //     const versionData = await Versions.findOne({ where: { ProjectID: id } });
//   //     return versionData;
//   //   }

//   static async saveToOnlineData(species) {
//     console.log("FOUND in base data::", species);

//     // save to db
//     const onlineDataBuilt = OnlineData.build({
//       ScientificName: species.ScientificName,
//       CommonName: species.CommonName,
//       TypeID: species.TypeID,
//       FamilyID: species.FamilyID,
//       SAII: species.SAII
//     });

//     await onlineDataBuilt.save();
//     console.log("\n Species saved to Online Data table database!\n\n");

//     return { species: onlineDataBuilt };
//   }
// }

// module.exports = OnlineDataService;
