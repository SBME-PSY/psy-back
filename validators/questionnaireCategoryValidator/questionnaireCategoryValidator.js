const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.slotsVlaidatorSchema = Joi.object({
  name: Joi.string(),
});
