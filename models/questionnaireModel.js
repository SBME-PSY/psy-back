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
      deafult: false,
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

const scoreSchema = new mongoose.Schema(
  {
    min: Number,
    max: Number,
    result: {
      type: String,
      intl: true,
    },
    description: {
      type: String,
      intl: true,
    },
  },
  { timestamps: true }
);

const questionnaireSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      intl: true,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionnaireCategory',
    },
    questions: [questionSchema],
    scores: [scoreSchema],
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'authorModel',
    },
    authorModel: {
      type: String,
      enum: ['Doctor', 'Admin'],
      required: true,
    },
  },
  { timestamps: true }
);

questionnaireSchema.plugin(mongooseIntl, {
  languages: ['en', 'ar'],
});

const questionnaireModel = mongoose.model('Questionnair', questionnaireSchema);

module.exports = questionnaireModel;
