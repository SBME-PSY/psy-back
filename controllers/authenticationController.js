const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');
const authFun = require('../utils/authFun');

exports.signUp = async (req, res, next) => {
  try {
    let newUser;
    if (req.body.role === 'doctor') {
      newUser = await doctorModel.create(req.body);
    } else if (req.body.role === 'user') {
      newUser = await userModel.create(req.body);
    }
    const token = authFun.getSignToken(newUser._id);
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
    const isEmail = req.body.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    console.log(isEmail);
    const emialOrPhone = isEmail ? 'email' : 'phone';
    console.log(emialOrPhone);
    const emialOrPhoneValue = req.body.email;
    const { password } = req.body;
    //1)check if the uer didint enter email or password
    if (!emialOrPhoneValue || !password) {
      return next(new AppError('please enter emailorPhone and password'), 400);
    }

    const query = { [emialOrPhone]: emialOrPhoneValue };
    //1)get the user or doctor
    const user = await authFun.findUser(req, res, query); //find user that may be user or doctor
    //2)check if there is no user or check if the password is not correct
    if (!user || !(await authFun.isCorrectPassword(password, user.password))) {
      return next(
        new AppError(
          'there is no user with that email please sign up first or password is not correct'
        ),
        401
      );
    }
    const token = authFun.getSignToken(user._id);
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
    if (
      await authFun.IsChangedPasswordAfterGetToken(
        decodedPyload.iat,
        currentUser
      )
    ) {
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
    //1)get the user or doctor
    const query = { email: req.body.email };
    const currentUser = await authFun.findUser(req, res, query);
    if (!currentUser) {
      return next(new AppError('no user or doctor with this email '));
    }
    // 2) Generate the random reset token and save it avraiable in db
    const userResetPassword = await authFun.createPasswordReset(currentUser);
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
    const query = {
      passwordResetToken: hashedRestToken,
      restPasswordExpires: { $gt: Date.now() },
    };
    const user = await authFun.findUser(req, res, query);
    if (!user) next(new AppError('your reset token is expired'));
    //2)if its ok reset password and give the jwt
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    //we use user.save instead of user update baecause of we eed check validator
    await user.save();
    const token = authFun.getSignToken(user._id);
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
    const query = { _id: req.user.id };
    console.log(query);
    const user = await authFun.findUser(req, res, query);
    // 2) Check if POSTed password match current password is correct
    if (
      !(await authFun.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    await user.save();
    const token = authFun.getSignToken(user._id);

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
