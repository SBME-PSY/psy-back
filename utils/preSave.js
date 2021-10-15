const bcrypt = require('bcryptjs');

exports.cryptPassword = async function (next) {
  // Check to see if password is modified. If it is, encrypt it. If not, execute next();
  console.log(!this.isModified('password'));
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
};
exports.setTimePasswordChangedAt = function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  console.log(this.passwordChangedAt);
  next();
};
