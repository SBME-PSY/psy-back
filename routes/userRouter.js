const express = require('express');

const authentcationController = require('../controllers/authenticationController');

const router = express.Router();
router.route('/signUp').post(authentcationController.signUp);
module.exports = router;
