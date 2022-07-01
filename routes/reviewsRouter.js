const express = require('express');
const { authorize } = require('../middleware');
const { authFun } = require('../utils');
const { reviewsController } = require('../controllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewsController.getReviews)
  .post(
    authFun.protect,
    authorize.authorize('user'),
    reviewsController.addReview
  );

router.route('/:id').get(reviewsController.getReview);

module.exports = router;
