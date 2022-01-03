const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.questionnaireResultValidators = Joi.object({
  questionnaireID: Joi.objectId,
  tags: Joi.string().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        body: Joi.string().required(),
        answers: Joi.array().items(
          Joi.object({
            body: Joi.string().required(),
            weight: Joi.number().required(),
            choosen: Joi.boolean().required(),
            _id: Joi.objectId(),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
          })
        ),
        _id: Joi.objectId(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
      })
    )
    .required(),
});
