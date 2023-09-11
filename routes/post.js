const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
//const verifyToken = require('../utility/verifyToken');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('index');
});
router.post('/', verifyToken, post_controller.create_post);
router.get('/user/:id', post_controller.get_post_by_userid);
router.get('/userposts', verifyToken, post_controller.get_user_post);
router.delete('/:id', verifyToken, post_controller.delete_post);
router.get('/:id', post_controller.get_post_by_id);
router.post('/:id/comment', verifyToken, comment_controller.create_comment);
router.delete('/comment/:id', verifyToken, comment_controller.delete_comment);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
