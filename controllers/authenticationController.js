const userModel = require('../models/userModel');

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await userModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      err: err,
    });
  }
};
