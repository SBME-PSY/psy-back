const express = require('express');
const { resultController } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');

const router = express.Router();
router
  .route('/')
  .get(
    authFun.protect,
    authorize.authorize('user'),
    resultController.getUserResults
  )
  .post(
    authFun.protect,
    authorize.authorize('user'),
    resultController.createResult
  );
module.exports = router;
