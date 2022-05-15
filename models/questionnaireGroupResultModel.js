const mongoose = require('mongoose');

const questionnaireGroupResultSchema = new mongoose.Schema(
  {
    groupID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionnaireGroup',
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
  },
  { timestamps: true }
);

const questionnairGroupResultModel = mongoose.model(
  'QuestionnairGroup',
  questionnaireGroupResultSchema
);

module.exports = questionnairGroupResultModel;
