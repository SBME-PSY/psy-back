const { asyncHandler, responseHandler } = require('../middleware');
const { resultModel, questionnairGroupResultModel } = require('../models');
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
    return next(new AppError(error, 400));
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
  if (value.groupID !== null) {
    if (value.sequence === null) {
      return next(new AppError('please enter sequence', 400));
    }
    result.groupID = value.groupID;
    result.sequence = value.sequence;

    if (result.sequence === 1) {
      await questionnairGroupResultModel.create({
        groupID: result.groupID,
        user: req.user._id,
        score: score,
      });
    } else {
      await questionnairGroupResultModel.update(
        {
          groupID: result.groupID,
          user: req.user._id,
        },
        {
          $inc: { score: score },
        }
      );
    }
  }
  const createdResult = await resultModel.create(result);
  responseHandler.sendResponse(res, 201, 'sucess', createdResult, null, null);
});
