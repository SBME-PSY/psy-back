const mongoose = require('mongoose');

const questionnairGroupSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: mongoose.Schem.Types.ObjectId,
  },
  { timestamps: true }
);

const questionnairGroupModel = mongoose.model(
  'QuestionnairGroup',
  questionnairGroupSchema
);

module.exports = questionnairGroupModel;
