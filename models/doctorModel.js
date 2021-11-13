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
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  phone: {
    type: String,
    maxLength: [13, 'the phone nuber is too long'],
    minLength: [11, 'the phone nuber is too short'],
    match: [/^(\+2)?01[0-25]\d{8}$/, 'Please add a valid phone number'],
    required: [true, 'a phone number is required'],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'refused'],
    default: 'pending',
  },
  cv: {
    type: String,
    // required: [true, 'please enter your cv'],
  },
  picture: {
    type: String,
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Seperated', 'Engaged', 'Widowed'],
  },
  address: String,
  birthday: Date,
});
//hash the password
doctorSchema.pre('save', preSave.cryptPassword);
doctorSchema.pre('save', preSave.setTimePasswordChangedAt);
doctorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
doctorSchema.pre('save', function () {
  if (!this.picture) {
    const uri = 'https://avatars.dicebear.com/api/initials/';
    const initials = this.name
      .split(' ')
      .reduce((init, str) => init + str[0], '');
    const seed = crypto.randomBytes(5).toString('hex');
    const picURL = `${uri + initials + seed}?size=50&radius=50.svg`;
    this.picture = picURL;
  }
});

const doctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = doctorModel;
