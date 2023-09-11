const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
/*exports.sign_up_get = asyncHandler(async (req, res, next) =>
  res.render('sign-up-form', {
    title: 'sign up',
  })
);*/
exports.sign_up = [
  (req, res, next) => {
    if (req.body.adminStatus == 1) {
      req.body.adminStatus = true;
    } else {
      req.body.adminStatus = false;
    }
    if (req.body.poster == 1) {
      req.body.poster = true;
    } else {
      req.body.poster = false;
    }
    next();
  },
  body('password', 'minimum length for password is 5 symbols')
    .isLength({
      min: 5,
    })
    .escape(),
  body('confirm_password', 'passwords, must match')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape(),
  body('email', 'email is used')
    .custom(async (value) => {
      const checkIfEmailIsUsed = await User.findOne({ email: value });
      console.log(checkIfEmailIsUsed);
      if (checkIfEmailIsUsed !== null) {
        return Promise.reject();
      } else Promise.resolve();
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors);
      return;
    } else {
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            return next(err);
          }
          console.log(req.body.adminStatus);

          console.log(typeof req.body.adminStatus);

          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            admin: req.body.adminStatus,
            poster: req.body.poster,
          });
          const token = jwt.sign(
            { user_id: user._id, user_email: user.email },
            process.env.TOKEN_KEY,
            {
              expiresIn: '2h',
            }
          );
          const result = await user.save();

          //res.redirect('/');
          res.send(token);
        });
      } catch (err) {
        return next(err);
      }
    }
  }),
];
exports.log_in = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  console.log(req.body.password);
  const match = await bcrypt.compare(req.body.password, user.password);
  console.log(match);
  if (match) {
    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        poster: user.poster,
        admin: user.admin,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );
    res.send(token);
  } else {
    res.send('error');
  }

  // save user token
});
/*exports.initiation_get = asyncHandler(async (req, res, next) =>
  res.render('initiation', {
    title: 'initiation',
  })
);
exports.initiation_post = [
  body('code', 'incorrect passcode')
    .custom((value) => {
      return value === 'secret';
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = await User.findById(req.params.id);
    if (!errors.isEmpty()) {
      res.render('initiation', {
        title: 'initiation',
        errors: errors,
      });
      return;
    } else {
      const newUser = new User({
        ...user,
        admin: user.admin,
        membership: true,
        _id: req.params.id,
      });
      await User.findByIdAndUpdate(req.params.id, newUser);
      res.redirect('/');
    }
  }),
];
exports.log_in_get = asyncHandler((req, res, next) => res.render('log-in'));*/
