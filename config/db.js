const mongoose = require('mongoose');

let dbUrl = process.env.MONGO_URL_DEV.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);
if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.MONGO_URL_TEST.replace(
    '<PASSWORD>',
    process.env.PASSWORD
  );
}
const connectDB = async () => {
  const conn = await mongoose.connect(dbUrl);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
