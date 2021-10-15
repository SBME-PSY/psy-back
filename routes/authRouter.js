const express = require('express');

const authentcationController = require('../controllers/authenticationController');

const router = express.Router();
router.route('/signUp').post(authentcationController.signUp);
router.route('/logIn').post(authentcationController.logIn);
router.route('/forgotPassword').post(authentcationController.forgotPassword);
router
  .route('/updatePassword')
  .patch(
    authentcationController.protect,
    authentcationController.updatePassword
  );
router.patch(
  '/resetPassword/:resetToken',
  authentcationController.resetPassword
);

module.exports = router;
