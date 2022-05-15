const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.questionnaireResultValidators = Joi.object({
  questionnaireID: Joi.objectId(),
  category: Joi.objectId(),
  questions: Joi.array()
    .items(
      Joi.object({
        body: Joi.string().required(),
        answers: Joi.array().items(
          Joi.object({
            body: Joi.string().required(),
            weight: Joi.number().required(),
            choosen: Joi.boolean().required(),
          })
        ),
      })
    )
    .required(),
  description: Joi.string().required(),
  rules: Joi.string().required(),
  score: Joi.number().required(),
  user: Joi.objectId(),
  groupID: Joi.objectId(),
  sequence: Joi.number(),
});
