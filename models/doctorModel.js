const mongoose = require('mongoose');
const preSave = require('../utils/preSave');

const doctorSchema = new mongoose.Schema({
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
      // this work only on Save or create not work  in update
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'refused'],
    default: 'pending',
  },
  cv: {
    type: String,
    required: [true, 'please enter your cv'],
  },
});
//hash the password
doctorSchema.pre('save', preSave.cryptPassword);
doctorSchema.pre('save', preSave.setTimePasswordChangedAt);

const doctorModel = mongoose.model('doctorModel', doctorSchema);

module.exports = doctorModel;
