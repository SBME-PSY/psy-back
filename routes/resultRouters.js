const express = require('express');
const resultController = require('../controllers/resultController');

const router = express.Router();
router.route('/').get(resultController.getAllResults);
router.route('/').post(resultController.careateResult);
module.exports = router;
