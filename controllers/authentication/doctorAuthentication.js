const doctorModel = require('../../models/doctorModel');
const AppError = require('../../utils/appError');
const asyncHandler = require('../../middleware/asyncHandler');
const authFun = require('../../utils/authFun');
const doctorValidators = require('../../validators/doctorValidators/doctorSignupValidations');

exports.signUp = asyncHandler(async (req, res, next) => {
  const { error, value } =
    doctorValidators.doctorSignupValidationScheme.validate(req.body);

  if (error) {
    console.log(error);
    return next(new AppError(error, 400));
  }

  const newUser = await doctorModel.create(value);

  const token = authFun.getSignToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token: token,
    data: newUser,
  });
});
