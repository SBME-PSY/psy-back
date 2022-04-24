const { userModel } = require('../models');
const { asyncHandler, responseHandler } = require('../middleware');
const { userValidators } = require('../validators');
const { AppError } = require('../utils');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await userModel.find();
  responseHandler.sendResponse(res, 200, 'success', allUsers, null, null);
});

exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.user.id)
    .select('name email picture createdAt address phone sex maritalStatus age');

  responseHandler.sendResponse(res, 200, 'success', user, null, null);
});

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  const { error, value } = userValidators.editUserProfile.validate(user);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const editedUser = await userModel.findByIdAndUpdate(req.user.id, value, {
    new: true,
    runValidators: true,
  });
  responseHandler.sendResponse(res, 200, 'success', editedUser, null, null);
});
