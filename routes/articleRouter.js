const express = require('express');

const router = express.Router();
const { articleController } = require('../controllers');
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
module.exports = router;
