const express = require('express');

const authentcationController = require('../controllers/authenticationController');
const doctorController = require('../controllers/doctorController');

const router = express.Router();
router
  .route('/getAllDoctors')
  .get(authentcationController.protect, doctorController.getAlldoctors);
module.exports = router;
