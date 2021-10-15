const userModel = require('../models/userModel');

exports.getAlldoctors = async (req, res, next) => {
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
