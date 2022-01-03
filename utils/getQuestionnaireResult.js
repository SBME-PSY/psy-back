const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware');
const { questionnaireModel } = require('../models');
const { AppError } = require('./index');

exports.getDescription = asyncHandler(
  async (score, answeredQuestionnnaireId) => {
    const scores = await questionnaireModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(`${answeredQuestionnnaireId}`),
        },
      },
      {
        $unwind: '$scores',
      },
      {
        $match: {
          'scores.min': { $lte: score },
          'scores.max': { $gte: score },
        },
      },
      {
        $project: {
          'scores.description': 1,
        },
      },
    ]);

    return scores[0].scores.description;
  }
);

exports.calacReasult = (req, res, next) => {
  let score = 0;
  const { questions } = req.body;
  const indexOfnotanswerdQuestions = [];
  questions.forEach((question, questionIndex) => {
    const { answers } = question;
    answers.forEach((answer, index, answerArr) => {
      // eslint-disable-next-line operator-assignment
      if (answer.choosen) {
        score += answer.weight;
        answerArr.length = index + 1; // like break()
      }
      //if answerArr.length == index+1  then there are one question or more not asnwerd
      else if (answerArr.length === index + 1) {
        //get not answed questions
        indexOfnotanswerdQuestions.push(questionIndex + 1);
      }
    });
  });
  if (indexOfnotanswerdQuestions.length) {
    next(
      new AppError(
        `this questions ${indexOfnotanswerdQuestions} not answerd `,
        403
      )
    );
  }
  return score;
};