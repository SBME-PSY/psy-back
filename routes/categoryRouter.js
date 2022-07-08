const express = require('express');

const router = express.Router({ mergeParams: true });
const { categoryController } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    authFun.protect,
    authorize.authorize('admin'),
    categoryController.addCategory
  );
module.exports = router;
