const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const AppError = require('./appError');
const { asyncHandler } = require('../middleware');
const { doctorModel, userModel, adminModel } = require('../models');

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
  return (
    (await bcrypt.compare(candidatePassword, passwordInDb)) ||
    candidatePassword === passwordInDb
  ); //will be changed later
};
const IsChangedPasswordAfterGetToken = function (jwtTimeIat, currentUser) {
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
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    next(new AppError('you never sign Up , Sign Up first'));
  }
  // 2) Verification token check if the token is vaaild
  const decodedPyload = await jwt.verify(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser =
    (await doctorModel.findById(decodedPyload.id)) ||
    (await userModel.findById(decodedPyload.id)) ||
    (await adminModel.findById(decodedPyload.id));
  if (!currentUser)
    next(
      new AppError(
        'The user belonging to this token does no longer exist please sign in first ',
        401
      )
    );
  // 4) Check if user change his password
  if (await IsChangedPasswordAfterGetToken(decodedPyload.iat, currentUser)) {
    return next(new AppError('You tried to login with old password', 401));
  }
  req.user = currentUser;
  next();
});
