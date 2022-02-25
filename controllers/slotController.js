const { slotModel } = require('../models');
const { AppError, checkClinicAvailable } = require('../utils');
const { asyncHandler, responseHandler } = require('../middleware');
const { slotValidators } = require('../validators');

exports.addSlot = asyncHandler(async (req, res, next) => {
  checkClinicAvailable(req.user.id, req.params.clinicId, next);
  req.body.doctorId = req.user.id;
  req.body.clinicId = req.params.clinicId;
  const { error, value } = slotValidators.slotsVlaidatorSchema.validate(
    req.body
  );
  if (error) {
    return next(new AppError(error, 400));
  }
  const slot = await slotModel.create(value);
  responseHandler.sendResponse(res, 200, 'success', slot, null, null);
});
exports.updateSlot = asyncHandler(async (req, res, next) => {
  checkClinicAvailable(req.user.id, req.params.clinicId, next);
  const slot = await slotModel.findById(req.params.slotId);
  if (!slot) {
    return next(
      new AppError('no slot with that id please add slot and try again', 400)
    );
  }
  const updatedSlot = await slotModel.findByIdAndUpdate(
    { _id: req.params.slotId },
    req.body,
    { new: true } //add run validator dosnt work right , will be added later problem 1
  );
  responseHandler.sendResponse(res, 200, 'success', updatedSlot, null, null);
});
exports.getClinicSlots = asyncHandler(async (req, res, next) => {
  checkClinicAvailable(req.user.id, req.params.clinicId, next);
  const clinicSlots = await slotModel.find({
    clinicId: req.params.clinicId,
  });
  responseHandler.sendResponse(res, 200, 'success', clinicSlots, null, null);
});
