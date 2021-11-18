const express = require('express');

const { adminAuthentication } = require('../controllers');

const router = express.Router();
router.route('/login').post(adminAuthentication.logIn);
module.exports = router;
