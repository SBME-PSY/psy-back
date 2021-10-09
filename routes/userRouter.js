const express = require('express');

const authentcationController = require('../controllers/authenticationController');
const userController = require('../controllers/userController');

const router = express.Router();
router.route('/signUp').post(authentcationController.signUp);
router.route('/logIn').post(authentcationController.logIn);
router.route('/forgotPassword').post(authentcationController.forgotPassword);
router.patch(
  '/resetPassword/:resetToken',
  authentcationController.resetPassword
);
router
  .route('/updatePassword')
  .patch(
    authentcationController.protect,
    authentcationController.updatePassword
  );
router
  .route('/getAllUsers')
  .get(authentcationController.protect, userController.getAllUsers);
module.exports = router;
