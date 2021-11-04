const crypto = require('crypto');
const doctorModel = require('../models/doctorModel');
const asyncHandler = require('../middleware/asyncHandler');

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

  res.status(200).json({ success: true, data: doctor });
});

exports.updateDoctorProfile = asyncHandler(async (req, res, next) => {
  if (req.file) req.body.picture = req.file.filename;

  if (req.body.name && !req.file) {
    const temp = await doctorModel.findById(req.user.id).select('picture');
    const uri = 'https://avatars.dicebear.com/api/initials/';
    if (temp.picture.startsWith(uri)) {
      const initials = req.body.name
        .split(' ')
        .reduce((init, str) => init + str[0], '');
      const seed = crypto.randomBytes(5).toString('hex');
      const picURL = `${uri + initials + seed}.svg`;
      req.body.picture = picURL;
    }
  }

  const doctor = await doctorModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: doctor });
});
