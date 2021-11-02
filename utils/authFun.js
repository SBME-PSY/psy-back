const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const adminModel = require('../models/adminModel');
const AppError = require('./appError');

exports.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

exports.getSignToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
exports.isCorrectPassword = async function (candidatePassword, passwordInDb) {
  return await bcrypt.compare(candidatePassword, passwordInDb);
};
exports.IsChangedPasswordAfterGetToken = async function (
  jwtTimeIat,
  currentUser
) {
  if (currentUser.passwordChangedAt) {
    const passwordChangedAtInSec = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimeIat < passwordChangedAtInSec;
  }

  // False means NOT changed
  return false;
};
exports.createPasswordReset = function (currentUser) {
  const resetToken = crypto.randomBytes(32).toString('hex');

  currentUser.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //resetToken Expires after 10miute
  currentUser.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

exports.findUser = async (req, res, query) => {
  //find the user that may be user or doctor
  let user;
  if (req.body.role === 'doctor') {
    user = await doctorModel.findOne(query).select('+password');
  } else if (req.body.role === 'user') {
    user = await userModel.findOne(query).select('+password');
  } else if (req.body.role === 'admin') {
    user = await adminModel.findOne(query).select('+password');
  }
  return user;
};
// her if func or configration for upload doctor cv
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/doctorPdf');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtention = file.mimetype.split('/')[1];
    const fileName = `doctorCv${uniqueSuffix}.${fileExtention}`;
    cb(null, fileName);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'pdf') {
    cb(null, true);
  } else {
    cb(new AppError('the file uploaded isnt pdf style', 400), false);
  }
};

exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1048576 }, //default 1 Mega ,1048576 byte is equal to 1 Mega
});
