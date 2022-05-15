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
});
