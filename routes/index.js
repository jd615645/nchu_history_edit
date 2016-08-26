var express = require('express');
var router = express.Router();
var path = require('path');
var io = require('socket.io')();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
