const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.reviewVlaidatorSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  modelID: Joi.objectId().required(true, 'modelID is required'),
  user: Joi.objectId().required(true, 'must be logged in to rate'),
  reviewFor: Joi.string().valid('doctor', 'clinic', 'article').required(),
});

exports.reviewUpdateSchema = Joi.object({
  title: Joi.string(),
  text: Joi.string(),
  rating: Joi.number().min(1).max(5),
});
