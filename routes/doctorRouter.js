const express = require('express');
const path = require('path');
const advancedResults = require('../middleware/advancedResults');
const fileUpload = require('../middleware/fileUpload');

const authentcationController = require('../controllers/authenticationController');
const authenticate = require('../controllers/authentication/doctorAuthentication');
const doctorController = require('../controllers/doctorController');

const router = express.Router();
router
  .route('/')
  .get(authentcationController.protect, doctorController.getAllDoctors);

router.route('/signup').post(authenticate.signUp);

router
  .route('/profile')
  .get(authentcationController.protect, doctorController.getDoctorProfile)
  .patch(
    authentcationController.protect,
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
