const express = require('express');
const { questionnaireController } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');
const categoryRouter = require('./categoryRouter');

const router = express.Router({ mergeParams: true });

router.use('/categories', categoryRouter);

router
  .route('/')
  .get(questionnaireController.getQuestionnairesByCategory)
  .post(
    authFun.protect,
    authorize.authorize('doctor', 'admin'),
    questionnaireController.createQuestionnaire
  );
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

router
  .route('/group')
  .post(
    authorize.authorize('admin', 'doctor'),
    questionnaireController.createQuestionnaireGroup
  );

module.exports = router;
