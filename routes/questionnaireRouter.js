const express = require('express');
const { questionnaireController } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router
  .route('/')
  .get(questionnaireController.getQuestionnaires)
  .post(
    authFun.protect,
    authorize('doctor'),
    questionnaireController.createQuestionnaire
  );
router
  .route('/:questionnaireId')
  .get(questionnaireController.getSingleQuestionnaire);

module.exports = router;
