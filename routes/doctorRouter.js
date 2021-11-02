const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const fileUpload = require('../middleware/fileUpload');

const authentcationController = require('../controllers/authenticationController');
const doctorController = require('../controllers/doctorController');

const router = express.Router();
router
  .route('/')
  .get(authentcationController.protect, doctorController.getAllDoctors);

router
  .route('/profile')
  .get(authentcationController.protect, doctorController.getDoctorProfile)
  .patch(
    authentcationController.protect,
    fileUpload.profilePicture,
    advancedResults.filterBody('name', 'email', 'phone'),
    doctorController.updateDoctorProfile
  );
module.exports = router;
