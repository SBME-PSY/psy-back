const mongoose = require('mongoose');
const mongooseIntl = require('mongoose-intl');

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      intl: true,
    },
    weight: Number,
    choosen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      intl: true,
    },
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
    result: {
      type: String,
      intl: true,
    },
    description: {
      type: String,
      intl: true,
    },
    rules: {
      type: String,
      intl: true,
    },
    groupID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionnaireGroup',
    },
    sequence: Number,
  },
  { timestamps: true }
);

resultSchema.plugin(mongooseIntl, {
  languages: ['en', 'ar'],
});

const resultModel = mongoose.model('Result', resultSchema);

module.exports = resultModel;
