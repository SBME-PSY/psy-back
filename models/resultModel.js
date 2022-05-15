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
    questionnaireID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Questionnair',
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionnaireCategory',
    },
    questions: [questionSchema],
    score: Number,
    description: String,
    rules: String,
    groupID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionnaireGroup',
    },
    sequence: Number,
  },
  { timestamps: true }
);

const resultModel = mongoose.model('Result', resultSchema);

module.exports = resultModel;
