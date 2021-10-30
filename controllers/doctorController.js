const doctorModel = require('../models/doctorModel');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/appError');

exports.getAllDoctors = asyncHandler(async (req, res, next) => {
  const allDoctors = await doctorModel.find();
  res.status(200).json({
    status: 'success',
    allDoctors,
  });
});

exports.getDoctorProfile = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel
    .findById(req.user.id)
    .select('name email picture createdAt');

  if (!doctor) {
    return next(new AppError(`No doctor found with id: ${req.user.id}`), 400);
  }

  res.status(200).json({ success: true, data: doctor });
});
