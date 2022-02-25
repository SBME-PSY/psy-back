const { clinicModel } = require('../models');
const { AppError } = require('./index');

const checkClinicAvailable = async (doctorId, clinicId, next) => {
  const clinic = await clinicModel.find({
    _id: clinicId,
    doctorId: doctorId,
  });
  if (!clinic.length) {
    return next(
      new AppError('no Clinic with that Id please Add Clinic  First', 400)
    );
  }
};
module.exports = checkClinicAvailable;
