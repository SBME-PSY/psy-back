const Joi = require('joi');

exports.cateoryVlaidatorSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().optional(),
  }).required(),
});
