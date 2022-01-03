const express = require('express');
const { questionnaireController } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');

const router = express.Router();

router.route('/').get(questionnaireController.getQuestionnaires);
router
  .route('/:questionnaireId')
  .get(questionnaireController.getSingleQuestionnaire);
router
  .route('/update-questionnaire/:questionnaireId')
  .put(
    authFun.protect,
    authorize.authorize('admin'),
    questionnaireController.UpdateQuestionnaire
  );
router
  .route('/delete-questionnaire/:questionnaireId')
  .delete(
    authFun.protect,
    authorize.authorize('admin'),
    questionnaireController.deleteQuestionnaire
  );
module.exports = router;
