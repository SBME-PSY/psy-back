const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    err: err,
    stack: err.stack,
  });
};
const sendProdError = (err, req, res, next) => {
  if (err.isOpertional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
const errorHandeler = (err, req, res, next) => {
  console.log('errr');
  if (process.env.NODE_ENV === 'production') {
    sendProdError(err, req, res, next);
  } else if (process.env.NODE_ENV === 'develpment') {
    sendDevError(err, res);
  }
};
module.exports = errorHandeler;
