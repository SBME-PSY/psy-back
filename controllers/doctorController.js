const path = require('path');
const fs = require('fs');
const APIFeatures = require('../utils/apiFeatures');

const { doctorModel, followUpRequestModel, userModel } = require('../models');
const { AppError } = require('../utils');
const { asyncHandler, responseHandler } = require('../middleware');
const { doctorValidators } = require('../validators');

exports.getAllDoctors = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(doctorModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doctors = await features.query;

  // SEND RESPONSE
  responseHandler.sendResponse(res, 200, 'sucess', doctors, null, null);
});

exports.getDoctorProfile = asyncHandler(async (req, res, next) => {
  const doctor = await doctorModel.findById(req.user.id);
  if (doctor.picture.startsWith('https://')) {
    responseHandler.sendResponse(res, 200, 'success', doctor, null, null);
  }

  fs.readFile(
    path.join(
      __dirname,
      `../public/doctors/profile-picture/${doctor.picture.split('/').pop()}`
    ),
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
  if (req.file)
    req.body.picture = `/static/doctors/profile-picture/${req.file.filename}`;

  const { error, value } =
    doctorValidators.updateDoctorValidationScheme.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  if (value.name && !req.file) {
    const temp = await doctorModel.findById(req.user.id).select('picture');

    const uri =
      'https://ui-avatars.com/api/?rounded=true&background=fff&size=512&name=';
    if (temp.picture.startsWith(uri)) {
      const initials = req.body.name.split(' ').join('+');
      const picURL = `${uri + initials}`;
      value.picture = picURL;
    }
  }

  let doctor = await doctorModel.findByIdAndUpdate(req.user.id, value, {
    new: true,
    runValidators: true,
  });

  if (req.file) {
    const ret = new Promise((resolve, reject) => {
      fs.readFile(
        path.join(
          __dirname,
          `../public/doctors/profile-picture/${req.file.filename}`
        ),
        (err, data) => {
          if (err) {
            reject(err);
          }
          const base64PictureUrl = `data:image/${
            req.file.filename.split('.')[1]
          };base64,${Buffer.from(data, 'base64')}`;
          doctor.picture = base64PictureUrl;
          resolve(doctor);
        }
      );
    });

    if (ret) {
      doctor = await ret;
    }
  }
  responseHandler.sendResponse(res, 200, 'success', doctor, null, null);
});

exports.getPendingFollowUpRequests = asyncHandler(async (req, res, next) => {
  const allFollowUpRequests = await followUpRequestModel.find({
    doctor: req.user._id,
    status: 'pending',
  });
  responseHandler.sendResponse(
    res,
    200,
    'success',
    allFollowUpRequests,
    null,
    null
  );
});

exports.followUpRequestResponse = asyncHandler(async (req, res, next) => {
  const { followUpRequestId, response } = req.body;
  const followUpRequest = await followUpRequestModel.findByIdAndUpdate(
    followUpRequestId,
    {
      status: response,
    },
    { new: true }
  );

  if (response === 'accepted') {
    await userModel.findByIdAndUpdate(followUpRequest.user, {
      doctorId: req.user._id,
    });
  } else if (response === 'rejected') {
    await userModel.findByIdAndUpdate(followUpRequest.user, {
      doctorId: null,
    });
  }

  responseHandler.sendResponse(
    res,
    200,
    'success',
    followUpRequest,
    null,
    null
  );
});
