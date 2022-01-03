const Joi = require('joi');

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
  tags: Joi.array().items(Joi.string()),
  rules: Joi.string().required(),
  description: Joi.string().required(),
});
