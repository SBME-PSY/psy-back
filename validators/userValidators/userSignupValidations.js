const Joi = require('joi');
const governorates = require('../../_data/governorates');
const maritalStatus = require('../../_data/maritalStatus');
const sex = require('../../_data/sex');

exports.userSignupValidationScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().normalize().lowercase().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref('password'),
  phone: Joi.string(),
  address: Joi.string(),
  sex: Joi.string().valid(...sex),
  maritalStatus: Joi.string().valid(...maritalStatus),
  role: Joi.string().equal('user'),
  birthday: Joi.string().isoDate(),
  age: Joi.number().integer().min(18),
  governorate: Joi.string().valid(...governorates),
  picture: Joi.string(),
});

exports.userLoginValidationScheme = Joi.object({
  email: Joi.string().normalize().lowercase().required(),
  password: Joi.string().required(),
  role: Joi.string().equal('user'),
});
