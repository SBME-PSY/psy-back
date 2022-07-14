const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const path = require('path');
const {
  articleRoutes,
  adminRoutes,
  userRoutes,
  doctorRoutes,
  resultRoutes,
  questionnaireRoutes,
  clinicRoutes,
  slotRoutes,
  reviewsRouter,
} = require('./routes');
const { AppError } = require('./utils');
const { errorController } = require('./controllers'); //in progress

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(mongoSanitize());
app.use(helmet());
app.use(express.json({ limit: '25mb' }));
app.use(cors());
app.use(hpp());

const limiter = rateLimit({
  max: 100,
  windowMs: 10 * 60 * 1000, // 10 minutes
  message: 'Too many requests from this IP, please try again in 10 minutes!',
});

const loginLimiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in 1 hour!',
});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/psy/users/login', loginLimiter);
app.use('/psy/doctors/login', loginLimiter);
app.use('/psy/admins/login', loginLimiter);
app.use('/psy/', limiter);
app.use('/psy/users', userRoutes);
app.use('/psy/doctors', doctorRoutes);
app.use('/psy/admins', adminRoutes);
app.use('/psy/articles', articleRoutes);
app.use('/psy/results', resultRoutes);
app.use('/psy/questionnaires', questionnaireRoutes);
app.use('/psy/clinics', clinicRoutes);
app.use('/psy/slots', slotRoutes);
app.use('/psy/reviews', reviewsRouter);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('*', (req, res, next) => {
  next(new AppError('Page Not Found ', 404));
});
app.use(errorController);
module.exports = app;
