const crypto = require('crypto');

const { doctorModel } = require('../../models');
const { AppError, authFun, sendEmail } = require('../../utils');
const { doctorAuthValidators } = require('../../validators');
const { asyncHandler, responseHandler, getQuery } = require('../../middleware');

exports.signUp = asyncHandler(async (req, res, next) => {
  const { error, value } =
    doctorAuthValidators.doctorSignupValidationScheme.validate(req.body);

  if (error) {
    return next(new AppError(error, 400));
  }

  if (req.file) value.cv = `/static/doctors/cvFile/${req.file.filename}`;

  delete value.cvFile;

  const newDoctor = await doctorModel.create(value);

  const token = authFun.getSignToken(newDoctor._id);
  responseHandler.sendResponse(res, 201, 'success', newDoctor, token, null);
});

exports.logIn = asyncHandler(async (req, res, next) => {
  const { error, value } =
    doctorAuthValidators.doctorLoginValidationScheme.validate(req.body);
  if (error) {
    return next(new AppError(error, 400));
  }
  //get search query
  const query = getQuery.getSearchObject(value); // {email:"+20100514723 or email:"xx@mail.com" , password:"1236344ss"}
  //1)get the doctor
  const currentDoctor = await doctorModel.findOne(query).select('+password');
  //2)check if there is no currentDoctor or check if the password is not correct

  if (
    !currentDoctor ||
    !(await authFun.isCorrectPassword(value.password, currentDoctor.password))
  ) {
    return next(
      new AppError('Email and password compination is not correct'),
      401
    );
  }
  const token = authFun.getSignToken(currentDoctor._id);
  responseHandler.sendResponse(res, 200, 'success', currentDoctor, token, null);
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1)get the user or doctor
  const query = { email: req.body.email };
  const currentDoctor = await doctorModel.findOne(query).select('+password');

  if (!currentDoctor) {
    return next(new AppError('no doctor with this email'));
  }
  // 2) Generate the random reset token and save it avraiable in db
  const userResetPassword = await authFun.createPasswordReset(currentDoctor);
  //because of we encrypte the password it will give us err that password and its confirm not equal
  await currentDoctor.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}${
    req.baseUrl
  }/reset-password/${userResetPassword}`;

  const message = `Forgot your password? Submit a PATCH request with your 
      new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget 
      your password, please ignore this email!`;

  await sendEmail({
    email: currentDoctor.email,
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
  const currentDoctor = await doctorModel.findOne(query).select('+password');

  if (!currentDoctor) next(new AppError('your reset token has expired'));
  //2)if its ok reset password and give the jwt
  currentDoctor.password = req.body.password;
  currentDoctor.confirmPassword = req.body.confirmPassword;
  currentDoctor.passwordResetToken = undefined;
  currentDoctor.passwordResetExpires = undefined;
  //we use currentDoctor.save instead of currentDoctor update baecause of we eed check validator
  await currentDoctor.save();
  const token = authFun.getSignToken(currentDoctor._id);
  //3) change the update password at field
  responseHandler.sendResponse(res, 200, 'success', null, token, null); // res.status(201).json({
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const query = { _id: req.user.id };
  const currentDoctor = await doctorModel.findOne(query).select('+password');
  // 2) Check if POSTed password match current password is correct
  if (
    !(await authFun.correctPassword(
      req.body.currentPassword,
      currentDoctor.password
    ))
  ) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  currentDoctor.password = req.body.newPassword;
  currentDoctor.confirmPassword = req.body.confirmNewPassword;
  await currentDoctor.save();
  const token = authFun.getSignToken(currentDoctor._id);

  // currentDoctor.findByIdAndUpdate will NOT work as intended!
  responseHandler.sendResponse(res, 200, 'success', null, token, null); // res.status(201).json({

  // 4) Log currentDoctor in, send JWT
});
