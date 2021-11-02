const express = require('express');

const authentcationController = require('../controllers/authenticationController');

const router = express.Router();
router
  .route('/signup')
  .post(authentcationController.uloadDoctorCv, authentcationController.signUp);
router.route('/login').post(authentcationController.logIn);
router.route('/forgot-password').post(authentcationController.forgotPassword);
router
  .route('/update-password')
  .patch(
    authentcationController.protect,
    authentcationController.updatePassword
  );
router.patch(
  '/reset-password/:resetToken',
  authentcationController.resetPassword
);

module.exports = router;
