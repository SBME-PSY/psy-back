const express = require('express');

const { userController, userAuthentication } = require('../controllers');
const { authFun } = require('../utils');

const router = express.Router();
router.route('/').get(authFun.protect, userController.getAllUsers);

router.route('/signup').post(userAuthentication.signUp);
router.route('/login').post(userAuthentication.logIn);
router.route('/forgot-password').post(userAuthentication.forgotPassword);
router
  .route('/reset-password/:resetToken')
  .patch(userAuthentication.resetPassword);
router
  .route('/update-password')
  .patch(authFun.protect, userAuthentication.updatePassword);
module.exports = router;
