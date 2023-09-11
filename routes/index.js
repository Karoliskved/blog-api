const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('index');
});
router.post('/sign-up', user_controller.sign_up);
router.post('/log-in', user_controller.log_in);
module.exports = router;
