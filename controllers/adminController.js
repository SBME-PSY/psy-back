const { asyncHandler } = require('../middleware');
const { doctorModel } = require('../models');
const { AppError } = require('../utils');
const { responseHandler } = require('../middleware');
const { adminValidators } = require('../validators');

exports.getAllPendingApp = asyncHandler(async (req, res, next) => {
  const pedingApp = await doctorModel.find({ status: 'pending' });

  responseHandler.sendResponse(res, 200, 'success', pedingApp, null, null);
});

exports.applicationResponse = asyncHandler(async (req, res, next) => {
  const { error, value } =
    adminValidators.adminApproveApplicationSchema.validate(req.body);

  if (error) {
    return next(new AppError(error, 400));
  }
  const doctor = await doctorModel.findByIdAndUpdate(req.params.id, value, {
    new: true,
    runValidators: true,
  });
  responseHandler.sendResponse(res, 200, 'success', doctor, null, null);
});
