const Joi = require('joi');
const AppError = require('../../utils/appError');

const maritalStatus = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Seperated',
  'Engaged',
];

const sex = ['Male', 'Female'];

exports.doctorSignupValidationScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .error(() => new AppError('Please enter a valid email address', 400))
    .normalize()
    .lowercase()
    .required(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
    .error(
      () =>
        new AppError(
          'Password must be at least 8 characters long and contain at least one number, one uppercase letter and one special character',
          400
        )
    ),
  confirmPassword: Joi.ref('password'),
  phone: Joi.string()
    .pattern(new RegExp('^(\\+2)?01[0-25]\\d{8}$'))
    .error(() => new AppError('Invalid Egyptian Phone Number', 400)),
  address: Joi.string(),
  sex: Joi.string().valid(...sex),
  maritalStatus: Joi.string().valid(...maritalStatus),
  role: Joi.string().equal('doctor'),
  birthday: Joi.string().isoDate(),
  cvFile: Joi.string(),
  age: Joi.number().min(22),
  profilePicture: Joi.string(),
  governorate: Joi.string().required(),
  specialization: Joi.string().required(),
});

exports.doctorLoginValidationScheme = Joi.object({
  email: Joi.string()
    .error(() => new AppError('Please enter a valid email address', 400))
    .normalize()
    .lowercase()
    .required(),
  password: Joi.string().required(),
  role: Joi.string().equal('doctor'),
});
