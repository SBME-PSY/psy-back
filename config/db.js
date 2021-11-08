const mongoose = require('mongoose');
const AppError = require('../utils/appError');

if (!process.env.MONGO_URL_DEV) {
  throw new AppError('MONGO_URL_DEV is not defined', 500);
}
let dbUrl = process.env.MONGO_URL_DEV.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);
if (process.env.NODE_ENV === 'test') {
  if (!process.env.MONGO_URL_TEST) {
    throw new AppError('MONGO_URL_TEST is not defined', 500);
  }
  dbUrl = process.env.MONGO_URL_TEST.replace(
    '<PASSWORD>',
    process.env.PASSWORD
  );
}
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUrl);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    throw new AppError('Failed to connect to database', 500);
  }
};

module.exports = connectDB;
