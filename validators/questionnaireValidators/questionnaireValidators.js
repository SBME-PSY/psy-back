const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.questionnaireGroupSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.objectId(),
});

exports.questionnairSchema = Joi.object({
  questions: Joi.array()
    .items(
      Joi.object({
        body: Joi.string().required(),
        answers: Joi.array().items(
          Joi.object({
            body: Joi.string().required(),
            weight: Joi.number().required(),
          })
        ),
      })
    )
    .required(),
  scores: Joi.array().items(
    Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required(),
      result: Joi.string().required(),
      description: Joi.string(),
    })
  ),
  category: Joi.objectId(),
  rules: Joi.string().required(),
  description: Joi.string().required(),
  groupID: Joi.objectId(),
  sequence: Joi.number(),
});
