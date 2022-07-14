const express = require('express');

const router = express.Router({ mergeParams: true });
const { articleController } = require('../controllers');
const reviewsRouter = require('./reviewsRouter');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');

router
  .route('/')
  .post(
    authFun.protect,
    authorize.authorize('doctor'),
    articleController.createArticle
  )
  .get(articleController.getAllArticles);
router.route('/:id').get(articleController.getArticle);

router.use('/:modelID/reviews', reviewsRouter);

module.exports = router;
