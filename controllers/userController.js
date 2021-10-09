const userModel = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json({
      status: 'success',
      allUsers,
    });
  } catch (err) {
    next(err);
  }
};
