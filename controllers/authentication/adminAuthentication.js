const adminModel = require('../../models/adminModel');
const AppError = require('../../utils/appError');
const asyncHandler = require('../../middleware/asyncHandler');
const authFun = require('../../utils/authFun');
const adminValidators = require('../../validators/adminValidators/adminSignupValidations');
const getQuery = require('../../middleware/getQuery');
const responceMiddleware = require('../../middleware/responceMiddleware');

exports.logIn = asyncHandler(async (req, res, next) => {
  const { error, value } = adminValidators.adminLoginValidationScheme.validate(
    req.body
  );
  if (error) {
    return next(new AppError(error, 400));
  }
  //get search query
  const query = getQuery.getSearchObject(value); // {email:"+20100514723 or email:"xx@mail.com" , password:"1236344ss"}

  //1)get the doctor
  const currentAdmin = await adminModel.findOne(query).select('+password');
  //2)check if there is no currentAdmin or check if the password is not correct

  if (
    !currentAdmin ||
    !(await authFun.isCorrectPassword(value.password, currentAdmin.password))
  ) {
    return next(
      new AppError('Email and password compination is not correct'),
      401
    );
  }
  const token = authFun.getSignToken(currentAdmin._id);
  responceMiddleware.sendResponse(
    res,
    201,
    'success',
    currentAdmin,
    token,
    null
  );
});
