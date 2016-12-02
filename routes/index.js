var express = require('express');
var Host = require('../models/Host');//
var router = express.Router();
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

router.get('/host', needAuth, function(req, res, next) {
    res.render('host');
});
router.get('/', function(req, res, next) {
  Host.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('index', {hosts: docs});
  });
});
module.exports = router;
