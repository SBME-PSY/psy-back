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
    modelID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'reviewFor',
    },
    reviewFor: {
      type: String,
      enum: ['Doctor', 'Clinic', 'Article'],
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ReviewSchema.index({ modelID: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (modelID, reviewFor) {
  const obj = await this.aggregate([
    {
      $match: { modelID },
    },
    {
      $group: {
        _id: '$modelID',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model(reviewFor).findByIdAndUpdate(modelID, {
      rating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.modelID, this.reviewFor);
});

ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.modelID, this.reviewFor);
});

const reviewModel = mongoose.model('Review', ReviewSchema);
module.exports = reviewModel;
