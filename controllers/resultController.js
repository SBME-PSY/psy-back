const { asyncHandler, responseHandler } = require('../middleware');
const { resultModel } = require('../models');
const { getQuestionnaireResult } = require('../utils');
const { questionnaireResultValidators } = require('../validators');
const { AppError } = require('../utils');

exports.getUserResults = asyncHandler(async (req, res, next) => {
  const allResults = await resultModel.find({ user: req.user._id });
  responseHandler.sendResponse(res, 200, 'sucess', allResults, null, null);
});
exports.createResult = asyncHandler(async (req, res, next) => {
  const { error, value } =
    questionnaireResultValidators.questionnaireResultValidators.validate(
      req.body
    );
  if (error) {
    return next(new AppError('please enter questionnare id ', 400));
  }

  if (!req.body.questionnaireID) {
    return next(new AppError('please enter questionnare id ', 400));
  }
  const score = getQuestionnaireResult.calacReasult(value, res, next);
  const { questionnaireID } = value;
  const description = await getQuestionnaireResult.getDescription(
    score,
    questionnaireID,
    next
  );

  const result = {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...value,
    user: req.user._id,
    score: score,
    description: description,
  };
  const createdResult = await resultModel.create(result);
  responseHandler.sendResponse(res, 201, 'sucess', createdResult, null, null);
});
