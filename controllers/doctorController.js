const doctorModel = require('../models/doctorModel');
const asyncHandler = require('../middleware/asyncHandler');

exports.getAllDoctors = asyncHandler(async (req, res, next) => {
  const allDoctors = await doctorModel.find();
  res.status(200).json({
    status: 'success',
    allDoctors,
  });
});
