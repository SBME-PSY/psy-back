const express = require('express');

const userController = require('../controllers/userController');
const userAuthentication = require('../controllers/authentication/userAuthentication');

const router = express.Router();
router.route('/').get(userAuthentication.protect, userController.getAllUsers);

router.route('/signup').post(userAuthentication.signUp);
router.route('/login').post(userAuthentication.logIn);
router.route('/forgot-password').post(userAuthentication.forgotPassword);
router
  .route('/reset-password/:resetToken')
  .patch(userAuthentication.resetPassword);
router
  .route('/update-password')
  .patch(userAuthentication.protect, userAuthentication.updatePassword);
module.exports = router;
