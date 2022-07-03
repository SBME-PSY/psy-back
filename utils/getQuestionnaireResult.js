const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware');
const { questionnaireModel } = require('../models');
const { AppError } = require('./index');

exports.getDescription = asyncHandler(
  async (score, answeredQuestionnnaireId, next) => {
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
          'scores.result': 1,
        },
      },
    ]);
    if (!scores.length) {
      return next(new AppError('score error or score out of range ,', 400));
    }
    return {
      description: scores[0].scores.description,
      result: scores[0].scores.result,
    };
  }
);

exports.calacReasult = (value, res, next) => {
  let score = 0;
  const { questions } = value;
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
  } else return score;
};
