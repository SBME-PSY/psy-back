const express = require('express');

const { userController, userAuthentication } = require('../controllers');
const { authFun } = require('../utils');
const { authorize } = require('../middleware');
const doctorRouter = require('./doctorRouter');

const router = express.Router();
router.use('/find-doctor', doctorRouter);
router.route('/').get(authFun.protect, userController.getAllUsers);
router
  .route('/profile')
  .get(
    authFun.protect,
    authorize.authorize('user'),
    userController.getUserProfile
  )
  .patch(
    authFun.protect,
    authorize.authorize('user'),
    userController.updateUserProfile
  );
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
