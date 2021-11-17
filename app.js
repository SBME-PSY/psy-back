const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { userRoutes, adminRoutes, doctorRoutes } = require('./routes');
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
app.use('*', (req, res, next) => {
  next(new AppError('Page Not Found ', 404));
});
app.use(errorController);
module.exports = app;
