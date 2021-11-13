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
  role: {
    type: String,
    enum: ['doctor', 'user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
//hash the password
adminSchema.pre('save', preSave.cryptPassword);
adminSchema.pre('save', preSave.setTimePasswordChangedAt);
adminSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
const adminModel = mongoose.model('Admin', adminSchema);

module.exports = adminModel;
