const path = require('path');
const express = require('express');

const authentcationController = require('../controllers/authenticationController');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();
router.route('/signup').post(
  // fileUpload.setUploadParameters(
  //   'doctorCV',
  //   path.resolve(__dirname, '../public/doctors/cvFile'),
  //   'pdf'
  // ),
  // fileUpload.professionalCV,
  authentcationController.signUp
);
router.route('/login').post(authentcationController.logIn);
router.route('/forgot-password').post(authentcationController.forgotPassword);
router
  .route('/update-password')
  .patch(
    authentcationController.protect,
    authentcationController.updatePassword
  );
router
  .route('/reset-password/:resetToken')
  .patch(authentcationController.resetPassword);

module.exports = router;
