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
  const { error } =
    questionnaireResultValidators.questionnaireResultValidators.validate(
      req.body
    );
  if (error) {
    return next(new AppError(error, 400));
  }

  if (!req.body.questionnaireID) {
    return next(new AppError('please enter questionnare id ', 400));
  }
  const score = getQuestionnaireResult.calacReasult(req, res, next);
  const description = await getQuestionnaireResult.getDescription(
    score,
    req.body.questionnaireID
  );

  const result = {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...req.body,
    user: req.user._id,
    score: score,
    description: description,
  };
  const createdResult = await resultModel.create(result);
  responseHandler.sendResponse(res, 201, 'sucess', createdResult, null, null);
});
