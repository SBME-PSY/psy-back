const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

exports.articleSchemaValidator = joi.object({
  title: joi.string().trim().max(255).required(),
  body: joi.string().trim().required(),
  author: joi.objectId().required(),
});
