const mongoose = require('mongoose');

const questionnaireCategorySchema = new mongoose.Schema({
  name: String,
});

const questionnaireCategoryModel = mongoose.model(
  'QuestionnaireCategory',
  questionnaireCategorySchema
);

module.exports = questionnaireCategoryModel;
