const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: 'String',
      required: [true, 'title is required'],
    },
    body: {
      type: String,
      required: [true, 'article body is required'],
      minlength: [1000, 'article body must be at least 1000 characters'],
    },
    rating: {
      type: Number,
      max: 5,
      min: 0,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
  },
  { timestamps: true }
);

articleSchema.index(
  { title: 'text', body: 'text' },
  {
    weights: {
      title: 5,
      body: 1,
    },
  }
);

const articleModel = mongoose.model('Article', articleSchema);

module.exports = articleModel;
