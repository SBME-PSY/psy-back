const express = require('express');
const path = require('path');

const router = express.Router({ mergeParams: true });
const { categoryController } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');
const { fileUpload } = require('../middleware');

router
  .route('/')
  .post(
    authFun.protect,
    authorize.authorize('admin'),
    fileUpload.setUploadParametersSingle(
      'questionnaireCategory-',
      path.resolve(__dirname, '../public/questionnaires/categories'),
      'png'
    ),
    fileUpload.base64UploadSingle('picture'),
    categoryController.addCategory
  );
router.route('/').get(categoryController.getAllCategories);
module.exports = router;
