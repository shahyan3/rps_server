var express = require("express");
var router = express.Router();
var { Users } = require("../models/UsersModel");
var { Roles } = require("../models/RolesModel");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// router.get("/", async (req, res, next) => {
//   const projects = await ProjectService.getAllProjects();

//   if (projects) {
//     res.status(200).send({ all: projects });
//   } else {
//     res.status(404).send({ message: "No projects found in database!" });
//   }
// });

router.post("/", async (req, res, next) => {
  // sanitize invalid user / pass
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // authenticate
  let user = await Users.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(400).send("Invalid email or password.");

  // when - using hashing checking pass
  //   const validPassword = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPassword) return res.status(400).send("Invalid email or password.");

  //   const token = user.generateAuthToken();
  //   res.send(token);

  // identify role
  var roleID = user.RoleID;
  var role = await Roles.findOne({ where: { ID: roleID } });
  var userRole = role.Name;

  // JWT - generate token with payload  {their info } sent to the authenticated client
  // token generated against a private key used to uncode token i.e. payload data
  const token = jwt.sign(
    { id: user.ID, firstName: user.FirstName, role: userRole },
    "jwtPrivateKey"
  );

  res.status(200).send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
