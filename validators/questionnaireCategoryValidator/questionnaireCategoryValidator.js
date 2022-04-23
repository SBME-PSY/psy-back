const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.cateoryVlaidatorSchema = Joi.object({
  name: Joi.string().required(),
});
