const Joi = require('joi');

const maritalStatus = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Seperated',
  'Engaged',
];

const sex = ['Male', 'Female'];

exports.userSignupValidationScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().normalize().lowercase().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref('password'),
  phone: Joi.string(),
  address: Joi.string(),
  sex: Joi.string().valid(...sex),
  maritalStatus: Joi.string().valid(...maritalStatus),
  role: Joi.string().equal('user'),
  birthday: Joi.string().isoDate(),
});

exports.userLoginValidationScheme = Joi.object({
  email: Joi.string().email().normalize().lowercase().required(),
  password: Joi.string().required(),
  role: Joi.string().equal('user'),
});
