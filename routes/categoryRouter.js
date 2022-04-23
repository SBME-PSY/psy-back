const express = require('express');

const router = express.Router();
const { caegoryController } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');

router
  .route('/')
  .post(
    authFun.protect,
    authorize.authorize('admin'),
    caegoryController.addCategory
  );
router.route('/').get(caegoryController.getAllCategories);
module.exports = router;
