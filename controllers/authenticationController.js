const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const adminModel = require('../models/adminModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

const correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const getSignToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
const isCorrectPassword = async function (candidatePassword, passwordInDb) {
  return await bcrypt.compare(candidatePassword, passwordInDb);
};
const IsChangedPasswordAfterGetToken = async function (
  jwtTimeIat,
  currentUser
) {
  if (currentUser.passwordChangedAt) {
    const passwordChangedAtInSec = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimeIat < passwordChangedAtInSec;
  }

  // False means NOT changed
  return false;
};
const createPasswordReset = function (currentUser) {
  const resetToken = crypto.randomBytes(32).toString('hex');

  currentUser.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //resetToken Expires after 10miute
  currentUser.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
exports.signUp = async (req, res, next) => {
  try {
    let newUser;
    if (req.baseUrl === '/psy/doctor') {
      newUser = await doctorModel.create(req.body);
    } else if (req.baseUrl === '/psy/user') {
      newUser = await userModel.create(req.body);
    }
    const token = getSignToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token: token,
      data: {
        tour: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //1)check if the uer didint enter email or password
    if (!email || !password) {
      return next(new AppError('please enter email and password'), 400);
    }
    let user;

    if (req.baseUrl === '/psy/doctor') {
      user = await doctorModel.findOne({ email: email }).select('+password');
    } else if (req.baseUrl === '/psy/user') {
      user = await userModel.findOne({ email: email }).select('+password');
    } else if (req.baseUrl === '/psy/admin') {
      user = await adminModel.findOne({ email: email }).select('+password');
    }
    //2)check if there is no user or check if the password is not correct
    console.log(req.baseUrl);
    if (!user || !(await isCorrectPassword(password, user.password))) {
      return next(
        new AppError(
          'there is no user with that email please sign up first or password is not correct'
        ),
        401
      );
    }
    const token = getSignToken(user._id);
    res.status(201).json({
      status: 'success',
      data: {
        tour: user,
        token: token,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      next(new AppError('you never sign Up Sign Up first'));
    }
    // 2) Verification token check if the token is vaaild
    const decodedPyload = await jwt.verify(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser =
      (await userModel.findById(decodedPyload.id)) ||
      (await doctorModel.findById(decodedPyload.id));

    if (!currentUser)
      next(
        new AppError(
          'The user belonging to this token does no longer exist please sign in first ',
          401
        )
      );
    // 4) Check if user change his password
    if (await IsChangedPasswordAfterGetToken(decodedPyload.iat, currentUser)) {
      return next(
        new AppError(
          'password is changed after you get the token please sign in again  ',
          401
        )
      );
    }
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    let currentUser;
    if (req.baseUrl === '/psy/doctor') {
      currentUser = await doctorModel.findOne({ email: req.body.email });
    } else if (req.baseUrl === '/psy/user') {
      currentUser = await userModel.findOne({ email: req.body.email });
    }
    if (!currentUser) {
      return next(new AppError('no user or doctor with this email '));
    }
    // 2) Generate the random reset token and save it avraiable in db
    const userResetPassword = await createPasswordReset(currentUser);
    //because of we encrypte the password it will give us err that password and its confirm not equal
    await currentUser.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}${
      req.baseUrl
    }/resetPassword/${userResetPassword}`;

    const message = `Forgot your password? Submit a PATCH request with your 
      new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget 
      your password, please ignore this email!`;

    await sendEmail({
      email: currentUser.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    //1)get user based o the resetPasswodToken
    const hashedRestToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');
    let user;
    if (req.baseUrl === '/psy/doctor') {
      user = await doctorModel.findOne({
        passwordResetToken: hashedRestToken,
        restPasswordExpires: { $gt: Date.now() },
      });
    } else if (req.baseUrl === '/psy/user') {
      user = await userModel.findOne({
        passwordResetToken: hashedRestToken,
        restPasswordExpires: { $gt: Date.now() },
      });
    }
    if (!user) next(new AppError('your reset token is expired'));
    //2)if its ok reset password and give the jwt
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    //we use user.save instead of user update baecause of we eed check validator
    await user.save();
    const token = getSignToken(user._id);
    //3) change the update password at field

    res.status(201).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
};
exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    let user;
    if (req.baseUrl === '/psy/doctor') {
      user = await doctorModel.findById(req.user.id).select('+password');
      console.log(req.user._id, req.user, req.user.id);
    } else if (req.baseUrl === '/psy/user') {
      user = await userModel.findById(req.user.id).select('+password');
    }
    // 2) Check if POSTed current password is correct
    if (!(await correctPassword(req.body.currentPassword, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    await user.save();
    const token = getSignToken(user._id);

    // User.findByIdAndUpdate will NOT work as intended!
    res.status(201).json({
      status: 'success',
      token,
    });
    // 4) Log user in, send JWT
  } catch (err) {
    next(err);
  }
};
