const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, 'Please add some text to the review'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewFor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'for',
    },
    for: {
      type: String,
      enum: ['Doctor', 'Clinic', 'Article'],
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const reviewModel = mongoose.model('Review', ReviewSchema);
module.exports = reviewModel;
