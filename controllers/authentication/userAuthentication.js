const crypto = require('crypto');

const { userModel } = require('../../models');
const { AppError, authFun, sendEmail } = require('../../utils');
const { userAuthValidators } = require('../../validators');
const { asyncHandler, responseHandler, getQuery } = require('../../middleware');

exports.signUp = asyncHandler(async (req, res, next) => {
  const { error, value } =
    userAuthValidators.userSignupValidationScheme.validate(req.body);

  if (error) {
    return next(new AppError(error, 400));
  }

  const newUser = await userModel.create(value);

  const token = authFun.getSignToken(newUser._id);
  responseHandler.sendResponse(res, 201, 'success', newUser, token, null);
});

exports.logIn = asyncHandler(async (req, res, next) => {
  const { error, value } =
    userAuthValidators.userLoginValidationScheme.validate(req.body);
  if (error) {
    return next(new AppError(error, 400));
  }
  //get search query
  const query = getQuery.getSearchObject(value); // {email:"+20100514723 or email:"xx@mail.com" , password:"1236344ss"}

  //1)get the doctor
  const user = await userModel.findOne(query).select('+password');
  //2)check if there is no user or check if the password is not correct
  if (
    !user ||
    !(await authFun.isCorrectPassword(value.password, user.password))
  ) {
    return next(
      new AppError('Email and password compination is not correct'),
      401
    );
  }
  const token = authFun.getSignToken(user._id);
  responseHandler.sendResponse(res, 201, 'success', user, token, null);
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1)get the user or doctor
  const query = { email: req.body.email };
  const currentUser = await userModel.findOne(query).select('+password');

  if (!currentUser) {
    return next(new AppError('no user with this email'));
  }
  // 2) Generate the random reset token and save it avraiable in db
  const userResetPassword = await authFun.createPasswordReset(currentUser);
  //because of we encrypte the password it will give us err that password and its confirm not equal
  await currentUser.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}${
    req.baseUrl
  }/reset-password/${userResetPassword}`;

  const message = `Forgot your password? Submit a PATCH request with your 
      new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget 
      your password, please ignore this email!`;

  await sendEmail({
    email: currentUser.email,
    subject: 'Your password reset token (valid for 10 min)',
    message,
  });
  responseHandler.sendResponse(
    res,
    200,
    'success',
    null,
    null,
    'Token sent to email!'
  );
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1)get user based o the resetPasswodToken
  const hashedRestToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const query = {
    passwordResetToken: hashedRestToken,
    restPasswordExpires: { $gt: Date.now() },
  };
  const currentUser = await userModel.findOne(query).select('+password');

  if (!currentUser) next(new AppError('your reset token is expired'));
  //2)if its ok reset password and give the jwt
  currentUser.password = req.body.password;
  currentUser.confirmPassword = req.body.confirmPassword;
  currentUser.passwordResetToken = undefined;
  currentUser.passwordResetExpires = undefined;
  //we use currentUser.save instead of currentUser update baecause of we eed check validator
  await currentUser.save();
  const token = authFun.getSignToken(currentUser._id);
  //3) change the update password at field
  responseHandler.sendResponse(res, 200, 'success', null, token, null); // res.status(201).json({
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const query = { _id: req.user.id };
  const currentUser = await userModel.findOne(query).select('+password');
  // 2) Check if POSTed password match current password is correct
  if (
    !(await authFun.correctPassword(
      req.body.currentPassword,
      currentUser.password
    ))
  ) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  currentUser.password = req.body.newPassword;
  currentUser.confirmPassword = req.body.confirmNewPassword;
  await currentUser.save();
  const token = authFun.getSignToken(currentUser._id);

  // currentUser.findByIdAndUpdate will NOT work as intended!
  responseHandler.sendResponse(res, 200, 'success', null, token, null); // res.status(201).json({

  // 4) Log currentUser in, send JWT
});
