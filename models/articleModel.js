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
    ref: 'doctorModel',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const articleModel = mongoose.model('article', articleSchema);

module.exports = articleModel;
