var express = require("express");
var router = express.Router();

// #DEVELOPMENT TEST ROUTE
router.get("/", async (req, res, next) => {
  res.status(200).send({ message: "GET: SpeciesList" });
});

router.post("/", async (req, res, next) => {
  if (req.body) {
    // validate request
    // const { error, value } = projectSchema.validate(req.body);
    // if (error) {
    //   console.log("\n400 Bad Request: Can't save project to db\n");
    //   res.status(400).send(error.message);
    // } else {
    //   const project = await ProjectService.saveProject(value);
    //   res.status(200).send(project);
    // }
  }
});

module.exports = router;
