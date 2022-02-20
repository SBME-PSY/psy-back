const Joi = require('joi');

exports.clinicValidatorSchema = Joi.object({
  doctorId: Joi.objectId().required(),
  address: Joi.string().required(),
  pictures: Joi.array().items(Joi.string()),
  rating: Joi.number(),
  phoneNumbers: Joi.array().items(Joi.string()),
  price: Joi.number().required(),
});
