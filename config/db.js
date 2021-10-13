const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.CONNECTIONSTRING);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
