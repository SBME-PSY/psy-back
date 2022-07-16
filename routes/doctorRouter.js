const express = require('express');
const path = require('path');

const { advancedResults, fileUpload, authorize } = require('../middleware');
const { doctorController, doctorAuthentication } = require('../controllers');
const clinicRouter = require('./clinicRouter');
const reviewsRouter = require('./reviewsRouter');

const { authFun } = require('../utils');
const articleRouter = require('./articleRouter');

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(
    authFun.protect,
    authorize.authorize('user', 'doctor'),
    doctorController.getAllDoctors
  );

router
  .route('/signup')
  .post(
    fileUpload.setUploadParametersSingle(
      'doctorCV-',
      path.resolve(__dirname, '../public/doctors/cvFile'),
      'pdf'
    ),
    fileUpload.base64UploadSingle('cvFile'),
    doctorAuthentication.signUp
  );
router.route('/login').post(doctorAuthentication.logIn);
router.route('/forgot-password').post(doctorAuthentication.forgotPassword);
router
  .route('/reset-password/:resetToken')
  .patch(doctorAuthentication.resetPassword);
router
  .route('/update-password')
  .patch(authFun.protect, doctorAuthentication.updatePassword);
router
  .route('/profile')
  .get(authFun.protect, doctorController.getDoctorProfile)
  .patch(
    authFun.protect,
    authorize.authorize('doctor'),
    fileUpload.setUploadParametersSingle(
      'doctorPic-',
      path.resolve(__dirname, '../public/doctors/profile-picture'),
      'image'
    ),
    fileUpload.base64UploadSingle('profilePicture'),
    doctorController.updateDoctorProfile
  );

router
  .route('/followUp/pending')
  .get(doctorController.getPendingFollowUpRequests)
  .patch(doctorController.followUpRequestResponse);

router.use('/clinics', clinicRouter);
router.use('/:modelID/reviews', reviewsRouter);
router.use('/:doctorID/articles', articleRouter);

module.exports = router;
