const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const doctorRouter = require('./routes/doctorRouter');
const adminRouter = require('./routes/adminRouter');
const AppError = require('./utils/appError');
const errorHandeler = require('./controllers/errorController'); //in progress

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/psy/users', authRouter, userRouter);
app.use('/psy/doctors', doctorRouter);
app.use('/psy/admins', authRouter, adminRouter);
app.use('*', (req, res, next) => {
  next(new AppError('This route is not defind ', 404));
});
app.use(errorHandeler);
module.exports = app;
