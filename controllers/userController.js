const userModel = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');
const responceMiddleware = require('../middleware/responceMiddleware');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await userModel.find();
  responceMiddleware.sendResponse(res, 200, 'success', allUsers, null, null);
});
