const userModel = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await userModel.find();
  res.status(200).json({
    status: 'success',
    allUsers,
  });
});
