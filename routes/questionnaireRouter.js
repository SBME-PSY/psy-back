const express = require('express');
const { questionnaireController } = require('../controllers');

const router = express.Router();

router.route('/').get(questionnaireController.getQuestionnaires);
router
  .route('/:questionnaireId')
  .get(questionnaireController.getSingleQuestionnaire);

module.exports = router;
