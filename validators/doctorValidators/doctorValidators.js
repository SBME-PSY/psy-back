const Joi = require('joi');
const AppError = require('../../utils/appError');
const sex = require('../../_data/sex');
const maritalStatus = require('../../_data/maritalStatus');

exports.updateDoctorValidationScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string()
    .error(() => new AppError('Please enter a valid email address', 400))
    .normalize()
    .lowercase(),
  phone: Joi.string()
    .pattern(new RegExp('^(\\+2)?01[0-25]\\d{8}$'))
    .error(() => new AppError('Invalid Egyptian Phone Number', 400)),
  address: Joi.string(),
  sex: Joi.string().valid(...sex),
  maritalStatus: Joi.string().valid(...maritalStatus),
  birthday: Joi.string().isoDate(),
  age: Joi.number().min(22),
  picture: Joi.string(),
  governorate: Joi.string(),
  specialization: Joi.string(),
  profilePicture: Joi.string(),
});
