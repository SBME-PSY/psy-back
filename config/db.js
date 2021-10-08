const mongoose = require('mongoose');

// const mongoUrl = process.env.MONGO_URL.;replace(
//   '<PASSWORD>',
//   process.env.PASSWORD
// );
const dbUrl = process.env.MONGO_URL.replace('<PASSWORD>', process.env.PASSWORD);
const connectDB = async () => {
  const conn = await mongoose.connect(dbUrl);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
