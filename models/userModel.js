const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['doctor', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      // this work only on .Save or create not work  in update
      validator: function (val) {
        return this.password === val;
      },
      message: 'the password should be the same as confirmPassword',
    },
    required: [true, 'confirmpasswrd is require'],
  },
  phone: {
    type: String,
    match: [/^01[0-2]\d{1,8}$/, 'Please add a valid phone number'],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});
//hash the password
userSchema.pre('save', async function (next) {
  this.password = 'Saeed1234__';
  // Check to see if password is modified. If it is, encrypt it. If not, execute next();
  console.log(!this.isModified('password'));
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.isCorrectPassword = async function (
  candidatePassword,
  passwordInDb
) {
  console.log('in the iscorrect func');
  console.log(await bcrypt.compare(candidatePassword, passwordInDb));
  return await bcrypt.compare(candidatePassword, passwordInDb);
};
userSchema.methods.IsChangedPasswordAfterGetToken = async function (
  jwtTimeIat
) {
  if (this.passwordChangedAt) {
    const passwordChangedAtInSec = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimeIat < passwordChangedAtInSec;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  //resetToken Expires after 10miute
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;
