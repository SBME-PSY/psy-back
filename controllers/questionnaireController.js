const { asyncHandler, responseHandler } = require('../middleware');
const { questionnaireModel, questionnaireGroup } = require('../models');
const { AppError } = require('../utils');
const { questionnaireValidators } = require('../validators');

exports.getQuestionnairesByCategory = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.query;

  const questionnaires = await questionnaireModel
    .find({
      category: categoryID,
    })
    .select('title _id description author authorModel')
    .populate({ path: 'author', select: 'name' });

  responseHandler.sendResponse(res, 200, 'sucess', questionnaires, null, null);
});

exports.getSingleQuestionnaire = asyncHandler(async (req, res, next) => {
  let questionnaire = await questionnaireModel
    .findById(req.params.questionnaireId)
    .populate({ path: 'author', select: 'name' })
    .select('-scores');

  if (!questionnaire.groupID) {
    return responseHandler.sendResponse(
      res,
      200,
      'sucess',
      questionnaire,
      null,
      null
    );
  }

  questionnaire = await questionnaireModel.findOne({
    groupID: questionnaire.groupID,
    sequence: req.body.sequence,
  });

  return responseHandler.sendResponse(
    res,
    200,
    'sucess',
    questionnaire,
    null,
    null
  );
});

exports.createQuestionnaire = asyncHandler(async (req, res, next) => {
  const { error, value } = questionnaireValidators.questionnairSchema.validate(
    req.body
  );

  if (error) {
    return next(new AppError(error, 400));
  }

  value.author = req.user._id;

  value.authorModel = req.user.role[0].toUpperCase() + req.user.role.slice(1);

  if (value.groupID !== null) {
    if (value.sequence === null) {
      return next(new AppError('please enter sequence', 400));
    }
  }

  const questionnair = await questionnaireModel.create(value);

  responseHandler.sendResponse(res, 201, 'success', questionnair, null, null);
});

exports.UpdateQuestionnaire = asyncHandler(async (req, res, next) => {
  const { error, value } = questionnaireValidators.questionnairSchema.validate(
    req.body
  );

  if (error) {
    return next(new AppError(error, 400));
  }
  const UpdatedQuestionnaire = await questionnaireModel.findByIdAndUpdate(
    req.params.questionnaireId,
    value,
    {
      new: true,
      runValidators: true,
    }
  );
  responseHandler.sendResponse(
    res,
    200,
    'sucess',
    UpdatedQuestionnaire,
    null,
    null
  );
});
exports.deleteQuestionnaire = asyncHandler(async (req, res, next) => {
  await questionnaireModel.findByIdAndDelete(req.params.questionnaireId);
  responseHandler.sendResponse(res, 204, 'sucess', null, null, null);
});

exports.createQuestionnaireGroup = asyncHandler(async (req, res, next) => {
  const { error, value } =
    questionnaireValidators.questionnaireGroupSchema.validate(req.body);

  if (error) {
    return next(new AppError(error, 400));
  }

  const questionnairGroup = await questionnaireGroup.create(value);

  responseHandler.sendResponse(
    res,
    201,
    'success',
    questionnairGroup._id,
    null,
    null
  );
});
