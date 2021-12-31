const { asyncHandler, responseHandler } = require('../middleware');
const { articleModel } = require('../models');
const { articleValidators } = require('../validators');
const { AppError, APIFeatures } = require('../utils');

exports.createArticle = asyncHandler(async (req, res, next) => {
  const { error, value } = articleValidators.articleSchemaValidator.validate(
    req.body
  );
  if (error) {
    return next(new AppError(error, 400));
  }
  const article = await articleModel.create(value);
  responseHandler.sendResponse(res, 200, 'sucess', article, null, null);
});
exports.getArticle = asyncHandler(async (req, res, next) => {
  const article = await articleModel.findById(req.params.id);
  responseHandler.sendResponse(res, 200, 'sucess', article, null, null);
});
exports.getAllArticles = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(articleModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const articles = await features.query;

  // SEND RESPONSE
  responseHandler.sendResponse(res, 200, 'sucess', articles, null, null);
});
