const mongoose = require('mongoose');
const crypto = require('crypto');
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
    enum: ['doctor', 'user', 'admin'],
    default: 'doctor',
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
    maxLength: [11, 'the phone nuber is too long'],
    minLength: [11, 'the phone nuber is too short'],
    match: [/^(\+2)?01[0-25]\d{8}$/, 'Please add a valid phone number'],
    required: [true, 'a phone number is required'],
    unique: true,
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
    //required: [true, 'please enter your cv'],
  },
  picture: {
    type: String,
  },
});
//hash the password
doctorSchema.pre('save', preSave.cryptPassword);
doctorSchema.pre('save', preSave.setTimePasswordChangedAt);
doctorSchema.pre('save', function () {
  if (!this.picture) {
    const uri = 'https://avatars.dicebear.com/api/initials/';
    const initials = this.name
      .split(' ')
      .reduce((init, str) => init + str[0], '');
    const seed = crypto.randomBytes(5).toString('hex');
    const picURL = `${uri + initials + seed}.svg`;
    this.picture = picURL;
  }
});

const doctorModel = mongoose.model('doctorModel', doctorSchema);

module.exports = doctorModel;
