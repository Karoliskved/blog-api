const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Comment = require('../models/comment');
const Post = require('../models/post');
require('dotenv').config();

exports.create_comment = [
  body('content', 'minimum length for content is 1')
    .isLength({
      min: 1,
    })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors);
      return;
    } else {
      jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
        if (err) {
          res.send(403);
        } else {
          console.log(authData.poster);
          const post = await Post.findOne({ _id: req.params.id });
          if (post.published) {
            const comment = new Comment({
              content: req.body.content,
              user: authData.user_id,
              post: req.params.id,
            });
            const result = await comment.save();
            res.json({
              message: 'comment created',
              authData: authData,
            });
          } else {
            res.send(403);
          }
        }
      });
    }
  }),
];

exports.delete_comment = asyncHandler(async (req, res, next) => {
  //only allows to get published works
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
    if (err) {
      res.send(403);
    } else {
      console.log(authData);
      const result = await Comment.findOne({ _id: req.params.id });
      if (result.user == authData.user_id || authData.admin == true) {
        result.deleteOne();
        res.send(200);
      }
    }
  });
});
