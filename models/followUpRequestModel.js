const mongoose = require('mongoose');

const followUpRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'refused', 'revoked'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const followUpRequestModel = mongoose.model(
  'FollowUpRequest',
  followUpRequestSchema
);

module.exports = followUpRequestModel;
