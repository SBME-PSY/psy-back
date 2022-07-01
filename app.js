const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {
  articleRoutes,
  adminRoutes,
  userRoutes,
  doctorRoutes,
  resultRoutes,
  questionnaireRoutes,
  clinicRoutes,
  slotRoutes,
  categoryRouter,
  reviewsRouter,
} = require('./routes');
const { AppError } = require('./utils');
const { errorController } = require('./controllers'); //in progress

const app = express();
app.use(express.json({ limit: '25mb' }));

app.use(cors());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/psy/users', userRoutes);
app.use('/psy/doctors', doctorRoutes);
app.use('/psy/admins', adminRoutes);
app.use('/psy/articles', articleRoutes);
app.use('/psy/results', resultRoutes);
app.use('/psy/questionnaires', questionnaireRoutes);
app.use('/psy/clinics', clinicRoutes);
app.use('/psy/slots', slotRoutes);
app.use('/psy/category', categoryRouter);
app.use('/psy/reviews', reviewsRouter);
app.use('*', (req, res, next) => {
  next(new AppError('Page Not Found ', 404));
});
app.use(errorController);
module.exports = app;
