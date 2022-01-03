const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    body: String,
    weight: Number,
    choosen: {
      type: Boolean,
      deafult: false,
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

const questionnairSchema = new mongoose.Schema(
  {
    tags: [String],
    questions: [questionSchema],
    scores: [scoreSchema],
    description: String,
    rules: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
  },
  { timestamps: true }
);

const questionnairModel = mongoose.model('Questionnair', questionnairSchema);

module.exports = questionnairModel;
