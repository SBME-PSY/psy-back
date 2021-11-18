const { AppError } = require('../utils');
//duplicate key error
const handleDuplicateUnique = (err) =>
  new AppError(`${JSON.stringify(err.keyValue)} Duplicate key value `, 400);
//validator error in mongoose
const handleValidatorError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid error input ${errors.join('. ')}`;
  return new AppError(message, 400);
};
// jwt token is not valid error
const handelJwtTokenErr = () => new AppError('Invalid Token', 401);
// jwt token is expire error
const handelJwtExpireErr = () => new AppError('Access token has expired', 401);
const handelFileSizeErr = () =>
  new AppError('File is too large, max file size is 1 Megabyte', 413);

//Production Errors
const sendProdError = (err, req, res, next) => {
  //is Opertinal to trust that error comes from error class
  if (err.isOpertional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //error comes from program not from user input on production
    res.status(err.statusCode).json({
      status: err.status,
      message: 'some thing wen wrong',
    });
  }
};
//Develpment Errors
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    err: err,
    stack: err.stack,
  });
};
const errorHandeler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //if it is not opertional it will be 500
  err.status = err.status || 'fail'; //if it is not opertional it will be 500
  console.log(err);
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    if (err.code === 11000) error = handleDuplicateUnique(error);
    if (err.name === 'ValidationError') error = handleValidatorError(error);
    if (err.name === 'JsonWebTokenError') error = handelJwtTokenErr(error);
    if (err.name === 'TokenExpiredError') error = handelJwtExpireErr(error);
    if (err.code === 'LIMIT_FILE_SIZE') error = handelFileSizeErr(error);
    sendProdError(error, req, res, next);
  } else if (process.env.NODE_ENV === 'development') {
    console.log(err.statusCode, err.status, err.message);
    sendDevError(err, res);
  }
};
module.exports = errorHandeler;
