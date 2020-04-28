var express = require("express");
var router = express.Router();
var { Users } = require("../models/UsersModel");
var { Roles } = require("../models/RolesModel");
const Joi = require("joi");

router.post("/", async (req, res, next) => {
  // sanitize invalid user / pass
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // authenticate
  let user = await Users.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(400).send("Invalid email or password.");

  // when - using hashing checking pass #TODO  when user register feature works via bycrpt
  //   const validPassword = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);

  // identify role
  var roleID = user.RoleID;
  var role = await Roles.findOne({ where: { ID: roleID } });
  var userRole = role.Name;

  // JWT - generate token with payload  {their info } sent to the authenticated client
  // const token = generateAuthToken(userRole);

  // Creating a response header x-auth-token and sending it back to the client with the jwt token
  // and the user info. This token is used to verify accessibility user's future endpoint requests
  res
    .header("x-auth-token", token)
    .send({ id: user.ID, firstName: user.FirstName, role: userRole });
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
