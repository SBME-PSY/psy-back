const express = require('express');
const { adminController, adminAuthentication } = require('../controllers');

const router = express.Router();
router.route('/login').post(adminAuthentication.logIn);
router.route('/pending-app').get(adminController.getAllPendingApp);
router.route('/app-response/:id').patch(adminController.applicationResponse);
router.route('/stats').get(adminController.getStats);

module.exports = router;
