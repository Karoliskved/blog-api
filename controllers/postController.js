const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const Comment = require('../models/comment');

require('dotenv').config();

exports.create_post = [
  body('title', 'minimum length for title is 1')
    .isLength({
      min: 1,
    })
    .escape(),
  body('content').escape(),
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
          if (authData.poster) {
            const post = new Post({
              title: req.body.title,
              content: req.body.content,
              published: req.body.published,
              user: authData.user_id,
            });
            const result = await post.save();
            res.json({
              message: 'Post created',
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
exports.get_post_by_userid = asyncHandler(async (req, res, next) => {
  //only allows to get published works
  const posts = await Post.find({ user: req.params.id, published: true });
  res.json({
    posts: posts,
  });
});
exports.get_user_post = asyncHandler(async (req, res, next) => {
  // allows to get all works
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
    if (err) {
      res.send(403);
    } else {
      console.log(authData);
      const posts = await Post.find({ user: authData.user_id });
      res.json({
        posts: posts,
      });
    }
  });
});
exports.get_post_by_id = asyncHandler(async (req, res, next) => {
  //only allows to get published works
  const post = await Post.findOne({ _id: req.params.id, published: true });
  const comments = await Comment.find({ post: req.params.id });
  res.json({
    posts: post,
    comments: comments,
  });
});

exports.delete_post = asyncHandler(async (req, res, next) => {
  //only allows to get published works
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
    if (err) {
      res.send(403);
    } else {
      console.log(authData);
      const post = await Post.findOne({ _id: req.params.id });
      try {
        if (post.user == authData.user_id || authData.admin == true) {
          post.deleteOne();
          const comments = await Comment.deleteMany({ post: req.params.id });
          res.send(200);
        } else {
          res.send(403);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
});
