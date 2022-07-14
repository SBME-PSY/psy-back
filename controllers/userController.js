const { userModel, followUpRequestModel, resultModel } = require('../models');
const { asyncHandler, responseHandler } = require('../middleware');
const { userValidators } = require('../validators');
const { AppError } = require('../utils');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await userModel.find();
  responseHandler.sendResponse(res, 200, 'success', allUsers, null, null);
});
exports.getUserTests = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const allUserTests = await resultModel.find({
    user: userId,
  });
  responseHandler.sendResponse(res, 200, 'success', allUserTests, null, null);
});
exports.getUserTest = asyncHandler(async (req, res, next) => {
  const resultid = req.params.resultID;

  const UserTest = await resultModel.findById(resultid);

  if (!UserTest) {
    return next(new AppError(`No result with the id of ${req.params.id}`, 404));
  }
  if (UserTest.user.toString() !== req.user.id) {
    return next(new AppError(`Not authorized to view the result`, 401));
  }
  responseHandler.sendResponse(res, 200, 'success', UserTest, null, null);
});
exports.doctorFollowUpRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { doctorId } = req.body;
  const followUpRequest = await followUpRequestModel.create({
    user: userId,
    doctor: doctorId,
  });
  responseHandler.sendResponse(
    res,
    201,
    'success',
    followUpRequest,
    null,
    null
  );
});

exports.getFollowUpRequestStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const followUpRequest = await followUpRequestModel.findOne({
    user: userId,
  });
  responseHandler.sendResponse(
    res,
    200,
    'success',
    { status: followUpRequest.status },
    null,
    null
  );
});

exports.revokeFollowUpRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const followUpRequest = await followUpRequestModel.findOneAndUpdate(
    { user: userId },
    { status: 'revoked' },
    { new: true }
  );

  if (!followUpRequest) {
    return new AppError(
      "Couldn't find follow up request with this specialist",
      400
    );
  }

  await userModel.findByIdAndUpdate(userId, {
    $set: {
      doctorId: null,
    },
  });

  responseHandler.sendResponse(
    res,
    200,
    'success',
    followUpRequest,
    null,
    null
  );
});

exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.user.id)
    .select('name email picture createdAt address phone sex maritalStatus age');

  responseHandler.sendResponse(res, 200, 'success', user, null, null);
});

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return next(new AppError(`No user with the id of ${req.user.id}`, 404));
  }

  const { error, value } = userValidators.editUserProfile.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const editedUser = await userModel.findByIdAndUpdate(req.user.id, value, {
    new: true,
    runValidators: true,
  });
  responseHandler.sendResponse(res, 200, 'success', editedUser, null, null);
});
