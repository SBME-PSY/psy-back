const express = require('express');
const resultController = require('../controllers/resultController');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');

const router = express.Router();
router
  .route('/')
  .get(
    authFun.protect,
    authorize.authorize('user'),
    resultController.getAllResults
  );
router
  .route('/:userId')
  .post(
    authFun.protect,
    authorize.authorize('user'),
    resultController.careateResult
  );
module.exports = router;
