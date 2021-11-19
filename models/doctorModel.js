const mongoose = require('mongoose');
const preSave = require('../utils/preSave');

const doctorSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ['pending', 'approved', 'refused'],
      default: 'pending',
    },
    cv: {
      type: String,
      required: [true, 'please enter your cv'],
    },
    picture: {
      type: String,
    },
    sex: {
      type: String,
      enum: ['Male', 'Female'],
    },
    maritalStatus: {
      type: String,
      enum: [
        'Single',
        'Married',
        'Divorced',
        'Seperated',
        'Engaged',
        'Widowed',
      ],
    },
    address: String,
    birthday: Date,
  },
  { timestamps: true }
);
//hash the password
doctorSchema.pre('save', preSave.cryptPassword);
doctorSchema.pre('save', preSave.setTimePasswordChangedAt);
doctorSchema.pre('save', function () {
  if (!this.picture) {
    const uri =
      'https://ui-avatars.com/api/?rounded=true&background=fff&size=512&name=';
    const initials = this.name.split(' ').join('+');
    const picURL = `${uri + initials}.png`;
    this.picture = picURL;
  }
});

const doctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = doctorModel;
