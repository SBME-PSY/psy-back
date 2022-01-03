const { asyncHandler, responseHandler } = require('../middleware');
const { questionnaireModel } = require('../models');
const { AppError } = require('../utils');
const { questionnaireValidators } = require('../validators');

exports.getQuestionnaires = asyncHandler(async (req, res, next) => {
  const questionnaires = await questionnaireModel.find();
  responseHandler.sendResponse(res, 200, 'sucess', questionnaires, null, null);
});
exports.getSingleQuestionnaire = asyncHandler(async (req, res, next) => {
  const questionnaire = await questionnaireModel.findById(
    req.params.questionnaireId
  );
  responseHandler.sendResponse(res, 200, 'sucess', questionnaire, null, null);
});

exports.createQuestionnaire = asyncHandler(async (req, res, next) => {
  const { error, value } = questionnaireValidators.questionnairSchema.validate(
    req.body
  );

  if (error) {
    return new AppError('Questionnair Schema is not valid', 400);
  }

  value.user = req.user._id;

  const questionnair = await questionnaireModel.create(value);

  responseHandler.sendResponse(res, 201, 'success', questionnair, null, null);
});
