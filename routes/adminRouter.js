const express = require('express');

const adminAuthentication = require('../controllers/authentication/adminAuthentication');

const router = express.Router();
router.route('/login').post(adminAuthentication.logIn);
module.exports = router;
