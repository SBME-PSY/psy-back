const path = require('path');
const fs = require('fs');
const APIFeatures = require('../utils/apiFeatures');

const { doctorModel, followUpRequestModel, userModel } = require('../models');
const { AppError } = require('../utils');
const { asyncHandler, responseHandler } = require('../middleware');

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
  const doctor = await doctorModel
    .findById(req.user.id)
    .select(
      'name email picture createdAt address phone sex maritalStatus clinics status'
    );
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
      const picURL = `${uri + initials}`;
      req.body.picture = picURL;
    }
  }

  const doctor = await doctorModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
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
