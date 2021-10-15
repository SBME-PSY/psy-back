const express = require('express');

const authentcationController = require('../controllers/authenticationController');

const router = express.Router();
router.route('/logIn').post(authentcationController.logIn);
module.exports = router;
