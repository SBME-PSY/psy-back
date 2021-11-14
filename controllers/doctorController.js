const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const doctorModel = require('../models/doctorModel');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/appError');
const responceMiddleware = require('../middleware/responceMiddleware');

exports.getAllDoctors = asyncHandler(async (req, res, next) => {
  const allDoctors = await doctorModel.find();
  responceMiddleware.sendResponse(res, 200, 'success', allDoctors, null, null);
});

exports.getDoctorProfile = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel
    .findById(req.user.id)
    .select('name email picture createdAt address phone sex maritalStatus');

  if (doctor.picture.startsWith('https://')) {
    return res.status(200).json({ success: true, data: doctor });
  }

  fs.readFile(
    path.join(__dirname, `../public/doctors/profile-picture/${doctor.picture}`),
    (err, data) => {
      if (err) {
        return new AppError("Couldn't retrieve doctor image", 500);
      }
      const base64PictureUrl = `data:image/${
        doctor.picture.split('.')[1]
      };base64,${Buffer.from(data, 'base64')}`;
      doctor.picture = base64PictureUrl;
      responceMiddleware.sendResponse(res, 200, 'success', doctor, null, null);
    }
  );
});

exports.updateDoctorProfile = asyncHandler(async (req, res, next) => {
  if (req.file) req.body.picture = req.file.filename;

  if (req.body.name && !req.file) {
    const temp = await doctorModel.findById(req.user.id).select('picture');
    console.log(temp);
    const uri = 'https://avatars.dicebear.com/api/initials/';
    if (temp.picture.startsWith(uri)) {
      const initials = req.body.name
        .split(' ')
        .reduce((init, str) => init + str[0], '');
      const seed = crypto.randomBytes(5).toString('hex');
      const picURL = `${uri + initials + seed}.svg?size=50&radius=50`;
      req.body.picture = picURL;
    }
  }

  const doctor = await doctorModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  responceMiddleware.sendResponse(res, 200, 'success', doctor, null, null);
});
