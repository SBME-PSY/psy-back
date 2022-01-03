const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    body: String,
    weight: Number,
    choosen: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    body: String,
    answers: [answerSchema],
  },
  { timestamps: true }
);

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: String,
    questions: [questionSchema],
    score: Number,
    description: String,
    rules: String,
  },
  { timestamps: true }
);

const resultModel = mongoose.model('Result', resultSchema);

module.exports = resultModel;
