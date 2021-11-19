const express = require('express');

const authentcationController = require('../controllers/authenticationController');
const adminController = require('../controllers/adminController');

const router = express.Router();
router.route('/logIn').post(authentcationController.logIn);
router.route('/pending-app').get(adminController.getAllPendingApp);
router.route('/App-response/:id').patch(adminController.ApplicationResponse);

module.exports = router;
