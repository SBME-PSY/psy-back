const { adminModel } = require('../../models');
const { AppError, authFun } = require('../../utils');
const { adminAuthValidators } = require('../../validators');
const { asyncHandler, responseHandler, getQuery } = require('../../middleware');

exports.logIn = asyncHandler(async (req, res, next) => {
  const { error, value } =
    adminAuthValidators.adminLoginValidationScheme.validate(req.body);
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
  responseHandler.sendResponse(res, 201, 'success', currentAdmin, token, null);
});
