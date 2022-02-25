const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.slotsVlaidatorSchema = Joi.object({
  doctorId: Joi.objectId(),
  clinicId: Joi.objectId(),
  from: Joi.date().required(),
  to: Joi.date().required(),
  reserved: Joi.boolean(),
});
