const { responseHandler, asyncHandler } = require('../middleware');
const { questionnaireCategoryModel } = require('../models');
const { questionnaireCategoryValidator } = require('../validators');
const { AppError } = require('../utils');

exports.addCategory = asyncHandler(async (req, res, next) => {
  const { error, value } =
    questionnaireCategoryValidator.slotsVlaidatorSchema.validate(req.body);
  if (error) {
    return next(new AppError(error, 400));
  }
  questionnaireCategoryModel.create(value);

  responseHandler.sendResponse(res, 201, 'success', value, null, null);
});
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const category = await questionnaireCategoryModel.find();
  responseHandler.sendResponse(res, 200, 'success', category, null, null);
});