const mongoose = require('mongoose');
const preSave = require('../utils/preSave');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
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
});
//hash the password
adminSchema.pre('save', preSave.cryptPassword);
adminSchema.pre('save', preSave.setTimePasswordChangedAt);
const adminModel = mongoose.model('adminmodels', adminSchema);

module.exports = adminModel;
