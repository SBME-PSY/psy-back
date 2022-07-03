const mongoose = require('mongoose');
const mongooseIntl = require('mongoose-intl');

const questionnairGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      intl: true,
    },
    description: {
      type: String,
      intl: true,
    },
    category: mongoose.Schem.Types.ObjectId,
  },
  { timestamps: true }
);

questionnairGroupSchema.plugin(mongooseIntl, {
  languages: ['en', 'ar'],
});

const questionnairGroupModel = mongoose.model(
  'QuestionnairGroup',
  questionnairGroupSchema
);

module.exports = questionnairGroupModel;
