const path = require('path');
const fs = require('fs');

const { doctorModel } = require('../models');
const { AppError } = require('../utils');
const { asyncHandler, responseHandler } = require('../middleware');

exports.getAllDoctors = asyncHandler(async (req, res, next) => {
  const allDoctors = await doctorModel.find();
  responseHandler.sendResponse(res, 200, 'success', allDoctors, null, null);
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
      responseHandler.sendResponse(res, 200, 'success', doctor, null, null);
    }
  );
});

exports.updateDoctorProfile = asyncHandler(async (req, res, next) => {
  if (req.file) req.body.picture = req.file.filename;

  if (req.body.name && !req.file) {
    const temp = await doctorModel.findById(req.user.id).select('picture');

    const uri =
      'https://ui-avatars.com/api/?rounded=true&background=fff&size=512&name=';
    if (temp.picture.startsWith(uri)) {
      const initials = req.body.name.split(' ').join('+');
      const picURL = `${uri + initials}.png`;
      req.body.picture = picURL;
    }
  }

  const doctor = await doctorModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  responseHandler.sendResponse(res, 200, 'success', doctor, null, null);
});
