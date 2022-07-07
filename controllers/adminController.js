const { asyncHandler } = require('../middleware');
const { doctorModel, resultModel, userModel } = require('../models');
const { AppError } = require('../utils');
const { responseHandler } = require('../middleware');
const { adminValidators } = require('../validators');

exports.getAllPendingApp = asyncHandler(async (req, res, next) => {
  const pedingApp = await doctorModel.find({ status: 'pending' });

  responseHandler.sendResponse(res, 200, 'success', pedingApp, null, null);
});

exports.applicationResponse = asyncHandler(async (req, res, next) => {
  const { error, value } =
    adminValidators.adminApproveApplicationSchema.validate(req.body);

  if (error) {
    return next(new AppError(error, 400));
  }
  const doctor = await doctorModel.findByIdAndUpdate(req.params.id, value, {
    new: true,
    runValidators: true,
  });
  responseHandler.sendResponse(res, 200, 'success', doctor, null, null);
});

exports.getStats = asyncHandler(async (req, res, next) => {
  const userStatsGender = await userModel.aggregate([
    {
      $group: {
        _id: null,
        numMales: { $sum: { $cond: [{ $eq: ['$sex', 'Male'] }, 1, 0] } },
        numFemales: { $sum: { $cond: [{ $eq: ['$sex', 'Female'] }, 1, 0] } },
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const userStatsGovernates = await userModel.aggregate([
    {
      $group: {
        _id: '$governorate',
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const doctorStatsGender = await doctorModel.aggregate([
    {
      $group: {
        _id: null,
        numMales: { $sum: { $cond: [{ $eq: ['$sex', 'Male'] }, 1, 0] } },
        numFemales: { $sum: { $cond: [{ $eq: ['$sex', 'Female'] }, 1, 0] } },
        numDoctors: { $sum: 1 },
      },
    },
  ]);
  const doctorStatsGovernates = await doctorModel.aggregate([
    {
      $group: {
        _id: '$governorate',
        numDoctors: { $sum: 1 },
      },
    },
  ]);
  const resultsGovernateStats = await resultModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'Patient',
      },
    },
    {
      $unwind: '$Patient',
    },
    {
      $addFields: {
        Patient_gov: '$Patient.governorate',
      },
    },
    {
      $group: {
        _id: '$Patient_gov',
        numPatients: { $sum: 1 },
      },
    },
  ]);
  const resultsTestsStats = await resultModel.aggregate([
    {
      $lookup: {
        from: 'questionnairs',
        localField: 'questionnaireID',
        foreignField: '_id',
        as: 'Test',
      },
    },
    {
      $unwind: '$Test',
    },

    {
      $addFields: {
        TestName: '$Test.title',
      },
    },
    {
      $group: {
        _id: '$TestName',
        numPatients: { $sum: 1 },
      },
    },
  ]);
  const resultsStats = await resultModel.aggregate([
    {
      $group: {
        _id: null,
        numResults: { $sum: 1 },
      },
    },
  ]);
  const resultsUniqueStats = await resultModel.aggregate([
    {
      $group: {
        _id: null,
        uniqueResults: { $addToSet: '$user' },
      },
    },
    {
      $unwind: '$uniqueResults',
    },
    {
      $group: {
        _id: null,
        numUniqueResults: { $sum: 1 },
      },
    },
  ]);

  responseHandler.sendResponse(
    res,
    200,
    'success',
    {
      userStatsGender,
      userStatsGovernates,
      doctorStatsGender,
      doctorStatsGovernates,
      resultsStats,
      resultsUniqueStats,
      resultsGovernateStats,
      resultsTestsStats,
    },
    null,
    null
  );
});
