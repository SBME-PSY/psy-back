const express = require('express');

const { reviewsController } = require('../controllers');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewsController.getReviews);

module.exports = router;
