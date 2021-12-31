const { asyncHandler } = require('../middleware');
const { resultModel } = require('../models');

exports.getAllResults = asyncHandler(async (req, res, next) => {
  const testingData = await resultModel.find();
  res.status(200).json({ status: 'success', data: testingData });
});
exports.careateResult = asyncHandler(async (req, res, next) => {
  const testingData = await resultModel.create(req.body);
  res.status(201).json({ status: 'success', data: testingData });
});
