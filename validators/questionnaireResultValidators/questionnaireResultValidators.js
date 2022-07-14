const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.questionnaireResultValidators = Joi.object({
  questionnaireID: Joi.objectId().required(),
  category: Joi.objectId().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        body: Joi.object({
          en: Joi.string(),
          ar: Joi.string(),
        }).required(),
        answers: Joi.array().items(
          Joi.object({
            body: Joi.object({
              en: Joi.string(),
              ar: Joi.string(),
            }).required(),
            weight: Joi.number().required(),
            choosen: Joi.boolean(),
          })
        ),
      })
    )
    .required(),
  rules: Joi.object({
    en: Joi.string(),
    ar: Joi.string(),
  }).required(),
  user: Joi.objectId(),
  groupID: Joi.objectId(),
  sequence: Joi.number(),
});
