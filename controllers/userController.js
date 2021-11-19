const { userModel } = require('../models');
const { asyncHandler, responseHandler } = require('../middleware');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await userModel.find();
  responseHandler.sendResponse(res, 200, 'success', allUsers, null, null);
});
