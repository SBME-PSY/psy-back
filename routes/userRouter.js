const express = require('express');

const authentcationController = require('../controllers/authenticationController');
const userController = require('../controllers/userController');

const router = express.Router();
router
  .route('/getAllUsers')
  .get(authentcationController.protect, userController.getAllUsers);
module.exports = router;
