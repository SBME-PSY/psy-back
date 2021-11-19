const asyncHandler = require('../middleware/asyncHandler');
const doctorModel = require('../models/doctorModel');

exports.getAllPendingApp = asyncHandler(async (req, res, next) => {
  const pedingApp = await doctorModel.find({ status: 'pending' });
  const appLength = pedingApp.length;
  res.status(200).json({
    status: 'success',
    count: appLength,
    data: pedingApp,
  });
});
exports.ApplicationResponse = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: doctor,
  });
});
