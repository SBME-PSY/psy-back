const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: 'String',
    required: [true, 'title is required'],
    unique: [true, 'isnt unique'],
  },
  body: {
    type: String,
    required: [true, 'article body is required'],
  },
  rating: {
    type: Number,
    max: 5,
    min: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const articleModel = mongoose.model('Article', articleSchema);

module.exports = articleModel;
