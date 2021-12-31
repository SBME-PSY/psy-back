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

const scoreSchema = new mongoose.Schema(
  {
    min: Number,
    max: Number,
    result: String,
    description: String,
  },
  { timestamps: true }
);

const resultSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId,
    tags: [String],
    questions: [questionSchema],
    scores: [scoreSchema],
    description: String,
    rules: String,
  },
  { timestamps: true }
);

const resultModel = mongoose.model('Result', resultSchema);

module.exports = resultModel;
