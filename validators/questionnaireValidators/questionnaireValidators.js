const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.questionnaireGroupSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  description: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  category: Joi.objectId(),
});

exports.questionnairSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
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
          })
        ),
      })
    )
    .required(),
  scores: Joi.array().items(
    Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required(),
      result: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
      }).required(),
      description: Joi.object({
        en: Joi.string(),
        ar: Joi.string(),
      }).required(),
    })
  ),
  category: Joi.objectId(),
  rules: Joi.object({
    en: Joi.string(),
    ar: Joi.string(),
  }),
  description: Joi.object({
    en: Joi.string(),
    ar: Joi.string(),
  }),
  groupID: Joi.objectId(),
  sequence: Joi.number(),
});
