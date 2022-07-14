const Joi = require('joi');
const governorates = require('../../_data/governorates');
const maritalStatus = require('../../_data/maritalStatus');
const sex = require('../../_data/sex');

exports.editUserProfile = Joi.object({
  name: Joi.string(),
  email: Joi.string().normalize().lowercase(),
  phone: Joi.string(),
  address: Joi.string(),
  sex: Joi.string().valid(...sex),
  maritalStatus: Joi.string().valid(...maritalStatus),
  role: Joi.string().equal('user'),
  birthday: Joi.string().isoDate(),
  age: Joi.number().integer().min(18),
  governorate: Joi.string().valid(...governorates),
});
