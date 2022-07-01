const { asyncHandler, responseHandler } = require('../middleware');
const { AppError, APIFeatures } = require('../utils');
const { reviewModel } = require('../models');
const { doctorModel, articleModel, clinicModel } = require('../models');
const { reviewVlaidator } = require('../validators');

const reviewPair = {
  doctor: ['Doctor', 'doctorID', doctorModel],
  article: ['Article', 'articleID', articleModel],
  clinic: ['Clinic', 'clinicID', clinicModel],
};

exports.getReviews = asyncHandler(async (req, res, next) => {
  let reviews;

  if (reviewPair[req.query.for]) {
    reviews = new APIFeatures(
      reviewModel.find({
        reviewFor: reviewPair[req.query.for][0],
        modelID: req.query[reviewPair[req.query.for][1]],
      }),
      req.query
    );
  } else {
    return next(new AppError('Invalid Request', 400));
  }

  reviews.filter().sort().limitFields().paginate();

  reviews = await reviews.query;

  responseHandler.sendResponse(res, 200, 'success', reviews);
});

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await reviewModel.findById(req.params.id).populate({
    path: `modelID`,
  });

  if (!review) {
    return next(new AppError(`No review with id ${req.params.id} found`, 404));
  }

  responseHandler.sendResponse(res, 200, 'success', review);
});

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.modelID = req.params.modelID;
  req.body.user = req.user.id;

  const { error, value } = reviewVlaidator.reviewVlaidatorSchema.validate(
    req.body
  );

  if (error) {
    return next(new AppError(error.message, 400));
  }

  const model = reviewPair[req.body.reviewFor][2].findById(value.modelID);

  if (!model) {
    return next(
      new AppError(
        `No ${reviewPair[req.body.reviewFor][0]} with id ${
          value.modelID
        } found`,
        404
      )
    );
  }

  value.reviewFor =
    value.reviewFor.charAt(0).toUpperCase() + value.reviewFor.slice(1);

  const review = await reviewModel.create(value);

  responseHandler.sendResponse(res, 201, 'success', review);
});
