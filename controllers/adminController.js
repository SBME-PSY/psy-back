const asyncHandler = require('../middleware/asyncHandler');
const doctorModel = require('../models/doctorModel');

exports.getAllPendingApp = asyncHandler(async (req, res, next) => {
  const pedingApp = await doctorModel.find({ status: 'pending' });
  const appLength = pedingApp.length;
  res.status(200).json({
    status: 'success',
    appLength,
    pedingApp,
  });
});
exports.rejectApp = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel.findByIdAndUpdate(
    req.params.id,
    { status: 'refused' },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    doctor,
  });
});
exports.approveApp = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    doctor,
  });
});
