const Joi = require('joi');

exports.adminLoginValidationScheme = Joi.object({
  email: Joi.string().normalize().lowercase().required(),
  password: Joi.string().required(),
  role: Joi.string().equal('admin'),
});
