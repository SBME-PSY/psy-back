const { asyncHandler, responseHandler } = require('../middleware');
const { articleModel } = require('../models');
const { articleValidators } = require('../validators');
const { AppError, APIFeatures } = require('../utils');

exports.createArticle = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;

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
  const article = await articleModel
    .findById(req.params.id)
    .populate({ path: 'author', select: 'name picture' });
  responseHandler.sendResponse(res, 200, 'sucess', article, null, null);
});

exports.getAllArticles = asyncHandler(async (req, res, next) => {
  let features;
  if (req.query.searchString) {
    features = new APIFeatures(
      articleModel
        .find({
          $text: { $search: req.query.searchString },
          score: { $meta: 'textScore' },
        })
        .populate({ path: 'author', select: 'name picture' })
        .sort({ score: { $meta: 'textScore' } }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
  } else {
    features = new APIFeatures(
      articleModel.find().populate({ path: 'author', select: 'name picture' }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
  }
  const articles = await features.query;

  responseHandler.sendResponse(res, 200, 'sucess', articles, null, null);
});
