const mongoose = require('mongoose');
const preSave = require('../utils/preSave');

const userSchema = new mongoose.Schema(
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
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      maxLength: [13, 'the phone nuber is too long'],
      minLength: [11, 'the phone nuber is too short'],
      match: [/^(\+2)?01[0-25]\d{8}$/, 'Please add a valid phone number'],
      required: [true, 'a phone number is required'],
      unique: true,
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
    birthday: {
      type: Date,
    },
    age: {
      type: Number,
      integer: true,
      min: 18,
    },
    picture: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);
//hash the password
userSchema.pre('save', preSave.cryptPassword);
userSchema.pre('save', preSave.setTimePasswordChangedAt);
userSchema.pre('save', function () {
  if (!this.picture) {
    const uri =
      'https://ui-avatars.com/api/?rounded=true&background=fff&size=512&name=';
    const initials = this.name.split(' ').join('+');
    const picURL = `${uri + initials}`;
    this.picture = picURL;
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
