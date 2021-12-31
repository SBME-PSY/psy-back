const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

exports.articleSchemaValidator = joi.object({
  title: joi.string().required(),
  body: joi.string().required(),
  rating: joi.number(),
  author: joi.objectId(),
});
