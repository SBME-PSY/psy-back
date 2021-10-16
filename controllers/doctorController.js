const doctorModel = require('../models/doctorModel');

exports.getAllDoctors = async (req, res, next) => {
  try {
    const allDoctors = await doctorModel.find();
    res.status(200).json({
      status: 'success',
      allDoctors,
    });
  } catch (err) {
    next(err);
  }
};
