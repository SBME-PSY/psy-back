const { asyncHandler, responseHandler } = require('../middleware');
const { AppError, APIFeatures } = require('../utils');
const { reviewModel } = require('../models');
const { doctorModel, articleModel, clinicModel } = require('../models');

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
