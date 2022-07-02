const mongoose = require('mongoose');
const mongooseIntl = require('mongoose-intl');

const questionnaireCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    intl: true,
  },
});

questionnaireCategorySchema.plugin(mongooseIntl, {
  languages: ['en', 'ar'],
});

const questionnaireCategoryModel = mongoose.model(
  'QuestionnaireCategory',
  questionnaireCategorySchema
);

module.exports = questionnaireCategoryModel;
