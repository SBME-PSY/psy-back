const { asyncHandler } = require('../middleware');
const { questionnaireModel } = require('../models');

exports.getQuestionnaires = asyncHandler(async (req, res, next) => {
  const questionnaires = await questionnaireModel.find();
  res.status(200).json({
    status: 'success',
    data: questionnaires,
  });
});
exports.getSingleQuestionnaire = asyncHandler(async (req, res, next) => {
  const questionnaire = await questionnaireModel.findById(
    req.params.questionnaireId
  );
  res.status(200).json({
    status: 'success',
    data: questionnaire,
  });
});
