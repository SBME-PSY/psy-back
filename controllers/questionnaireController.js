const { asyncHandler, responseHandler } = require('../middleware');
const { questionnaireModel } = require('../models');

exports.getQuestionnaires = asyncHandler(async (req, res, next) => {
  const questionnaires = await questionnaireModel.find().select('-scores');
  responseHandler.sendResponse(res, 200, 'sucess', questionnaires, null, null);
});
exports.getSingleQuestionnaire = asyncHandler(async (req, res, next) => {
  const questionnaire = await questionnaireModel
    .findById(req.params.questionnaireId)
    .select('-scores');
  responseHandler.sendResponse(res, 200, 'sucess', questionnaire, null, null);
});
