const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
exports.IsChangedPasswordAfterGetToken = function (jwtTimeIat, currentUser) {
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
