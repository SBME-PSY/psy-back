const { asyncHandler, responseHandler } = require('../middleware');
const { resultModel } = require('../models');

exports.getUserResults = asyncHandler(async (req, res, next) => {
  const allResults = await resultModel.find({ user: req.user._id });
  responseHandler.sendResponse(res, 200, 'sucess', allResults, null, null);
});
exports.createResult = asyncHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  const createdResult = await resultModel.create(req.body);
  responseHandler.sendResponse(res, 201, 'sucess', createdResult, null, null);
});
