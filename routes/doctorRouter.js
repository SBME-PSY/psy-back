const express = require('express');
const path = require('path');
const advancedResults = require('../middleware/advancedResults');
const fileUpload = require('../middleware/fileUpload');

// const authentcationController = require('../controllers/authenticationController');
const doctorAuthentication = require('../controllers/authentication/doctorAuthentication');
const doctorController = require('../controllers/doctorController');

const router = express.Router();
router
  .route('/')
  .get(doctorAuthentication.protect, doctorController.getAllDoctors);

router.route('/signup').post(doctorAuthentication.signUp);
router.route('/login').post(doctorAuthentication.logIn);
router.route('/forgot-password').post(doctorAuthentication.forgotPassword);
router
  .route('/reset-password/:resetToken')
  .patch(doctorAuthentication.resetPassword);
router
  .route('/update-password')
  .patch(doctorAuthentication.protect, doctorAuthentication.updatePassword);
router
  .route('/profile')
  .get(doctorAuthentication.protect, doctorController.getDoctorProfile)
  .patch(
    doctorAuthentication.protect,
    fileUpload.setUploadParameters(
      'doctorPic-',
      path.resolve(__dirname, '../public/doctors/profile-picture'),
      'image'
    ),
    fileUpload.base64Upload,
    advancedResults.filterBody(
      'name',
      'email',
      'phone',
      'sex',
      'maritalStatus',
      'picture',
      'address'
    ),
    doctorController.updateDoctorProfile
  );
module.exports = router;
