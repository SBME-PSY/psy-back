const { clinicModel } = require('../models');
const { AppError, checkClinicAvailable } = require('../utils');
const { asyncHandler, responseHandler } = require('../middleware');
const { clinicValidators } = require('../validators');

exports.addClinic = asyncHandler(async (req, res, next) => {
  req.body.doctorId = req.user.id;
  const { error, value } = clinicValidators.clinicValidatorSchema.validate(
    req.body
  );
  if (error) {
    return next(new AppError(error, 400));
  }
  const clinic = await clinicModel.create(value);

  responseHandler.sendResponse(res, 201, 'success', clinic, null, null);
});

exports.updateClinic = asyncHandler(async (req, res, next) => {
  checkClinicAvailable(req.user.id, req.params.clinicId, next);
  const clinic = await clinicModel.findByIdAndUpdate(
    req.params.clinicId,
    req.body
  );

  responseHandler.sendResponse(res, 200, 'success', clinic, null, null);
});

exports.getClinics = asyncHandler(async (req, res, next) => {
  const clinics = await clinicModel.find({
    doctorId: req.user.id,
  });

  responseHandler.sendResponse(res, 200, 'success', clinics, null, null);
});
