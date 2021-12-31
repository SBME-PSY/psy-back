const mongoose = require('mongoose');
const resultModel = require('./models/resultModel');

const answers = [
  {
    body: '0',
    weight: 0,
    choosen: false,
  },
  {
    body: '1',
    weight: 2,
    choosen: false,
  },
  {
    body: '2',
    weight: 4,
    choosen: false,
  },
  {
    body: '3',
    weight: 6,
    choosen: false,
  },
];

const questionnair = {
  user: '6198259645ec8538dad030e2',
  questions: [
    {
      body: 'I found it hard to wind down',
      answers: [...answers],
    },
    {
      body: 'I was aware of dryness of my mouth',
      answers: [...answers],
    },
    {
      body: 'I couldn’t seem to experience any positive feeling at all',
      answers: [...answers],
    },
    {
      body: 'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)',
      answers: [...answers],
    },
    {
      body: 'I found it difficult to work up the initiative to do things',
      answers: [...answers],
    },
    {
      body: 'I tended to over-react to situations',
      answers: [...answers],
    },
    {
      body: 'I experienced trembling (e.g. in the hands)',
      answers: [...answers],
    },
    {
      body: 'I felt that I was using a lot of nervous energy',
      answers: [...answers],
    },
    {
      body: 'I was worried about situations in which I might panic and make a fool of myself',
      answers: [...answers],
    },
    {
      body: 'I felt that I had nothing to look forward to',
      answers: [...answers],
    },
    {
      body: 'I found myself getting agitated',
      answers: [...answers],
    },
    {
      body: 'I found it difficult to relax',
      answers: [...answers],
    },
    {
      body: 'I felt down-hearted and blue',
      answers: [...answers],
    },
    {
      body: 'I was intolerant of anything that kept me from getting on with what I was doing',
      answers: [...answers],
    },
    {
      body: 'I felt I was close to panic',
      answers: [...answers],
    },
    {
      body: 'I was unable to become enthusiastic about anything',
      answers: [...answers],
    },
    {
      body: 'I felt I wasn’t worth much as a person',
      answers: [...answers],
    },
    {
      body: 'I felt that I was rather touchy',
      answers: [...answers],
    },
    {
      body: 'I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)',
      answers: [...answers],
    },
    {
      body: 'I felt scared without any good reason',
      answers: [...answers],
    },
    {
      body: 'I felt that life was meaningless',
      answers: [...answers],
    },
  ],
  tags: ['Depression', 'Anxiety', 'Stress'],
  scores: [
    {
      min: 0,
      max: 9,
      result: 'No Depression',
      description: 'There is no sign of depression',
    },
    {
      min: 0,
      max: 7,
      result: 'No Anxiety',
      description: 'There is no sign of anxiety',
    },
    {
      min: 0,
      max: 14,
      result: 'No Stress',
      description: 'There is no sign of stress',
    },
    {
      min: 10,
      max: 13,
      result: 'Mild Depression',
      description: 'You are experiencing a mild form of depression',
    },
    {
      min: 8,
      max: 9,
      result: 'Mild Anxiety',
      description: 'You are experiencing a mild form of anxity',
    },
    {
      min: 15,
      max: 18,
      result: 'Mild Stress',
      description: 'You are experiencing a mild form of stress',
    },
    {
      min: 14,
      max: 20,
      result: 'Moderate',
      description: 'You are experiencing a moderate form of depression',
    },
    {
      min: 10,
      max: 14,
      result: 'Moderate Anxity',
      description: 'You are experiencing a moderate form of anxity',
    },
    {
      min: 19,
      max: 25,
      result: 'Moderate Stress',
      description: 'You are experiencing a moderate form of stress',
    },
    {
      min: 21,
      max: 27,
      result: 'Severe Depression',
      description: 'You are experiencing a severe form of depression',
    },
    {
      min: 15,
      max: 19,
      result: 'Severe Anxity',
      description: 'You are experiencing a severe form of anxity',
    },
    {
      min: 26,
      max: 33,
      result: 'Severe Stress',
      description: 'You are experiencing a severe form of stress',
    },
    {
      min: 28,
      max: 42,
      result: 'Extremely Severe Depression',
      description: 'You are experiencing an extremely severe depression',
    },
    {
      min: 20,
      max: 42,
      result: 'Extremely Severe Anxity',
      description: 'You are experiencing an extremely severe anxity',
    },
    {
      min: 34,
      max: 42,
      result: 'Extremely Severe Stress',
      description: 'You are experiencing an extremely severe stress',
    },
  ],
};

const createQuestionnair = async (req, res) => {
  const dbUrl =
    'mongodb+srv://PSY:PD74oUbYQf8sL6dS@psy.jn5pk.mongodb.net/PSY-DEV?retryWrites=true&w=majority';
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(dbUrl);
      console.log(
        `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
      );
    } catch (err) {
      console.log(err);
    }
  };

  connectDB();

  await resultModel.create(questionnair, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
};

createQuestionnair();
