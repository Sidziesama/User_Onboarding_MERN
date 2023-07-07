/*This file builds the databse schema..
 * It also generates the JWT token if all the input credentials are valid and existing in the database.
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

//User Schema 

const userSchema = new mongoose.Schema({
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
  confirmPassword: { type: 'string', required: true },
  email: { type: 'string', required: true },
  collegeName: { type: 'string', required: true },
  isVerified: { type: 'boolean', default: false },
  otp: { type: 'string', default: '0' }
});

// JWT token generation
userSchema.methods.generateAuthToken = function () {

  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: "7d" })
  return token;
}

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({

    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    username: Joi.string().required().label("Username"),
    password: passwordComplexity().required().label("Password"),
    confirmPassword: passwordComplexity().required().label("Confirm Password"),
    email: Joi.string().required().label("Email ID"),
    collegeName: Joi.string().required().label("College Name")
  })
  return schema.validate(data);
}

module.exports = {
  User,
  validate
};
