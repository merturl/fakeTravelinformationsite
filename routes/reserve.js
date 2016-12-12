var express = require('express');
var Host = require('../models/Host');//Post를 사용
var User = require('../models/User');
var Reservation = require('../models/Reservation');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}

//게시글 작성시 form의 입력 유무 에러처리
function validateForm(form, options) {
  var title = form.title || "";
  var content = form.content || "";
  var address = form.address || "";
  content = content.trim();
  address = address.trim();
  
  // if (!title) {
  //   return '제목을 입력해주세요.';
  // }

  // if (!form.password && options.needPassword) {
  //   return '비밀번호를 입력해주세요.';
  // }
  // if (form.password.length < 6) {
  //   return '비밀번호는 6글자 이상이어야 합니다.';
  // }
  // if (!title) {
  //   return '제목을 입력해주세요.';
  // }
  // if (!content) {
  //   return '내용을 입력해주세요.';
  // }
  // return null;
  return null;
}

router.get('/:id', needAuth, function(req, res, next) {
  Host.findById(req.params.id, function(err, post) {
    if(post.user == req.user.id){
      req.flash('danger', '본인의 호스팅은 예약이 불가능합니다.');
      res.redirect('/');
    }
    if (err) {
      return next(err);
    }
    res.render('reserve/edit', {post: post});
  });
});

router.get('/', needAuth, function(req, res, next) {
  Reservation.find({user:req.user.id}, function(err, reservations) {
    if (err) {
      return next(err);
    }
    Host.find({_id:reservations.post}, function(err, host) {
        if (err) {
          return next(err);
        }
        res.render('reserve/show', {reservations: reservations, host: host});
      });
  });
});
2
router.post('/:id', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    return res.redirect('back');
  }
  
  Host.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
     }
    var newReservation = new Reservation({
      post: req.params.id,
      user: req.user.id,
      hostuser: post.user,
      email: req.user.email,
      hostemail: post.email,
    });
    newReservation.persons = req.body.persons;
    newReservation.charge = req.body.charge;
    newReservation.checkin = req.body.checkin;
    newReservation.checkout = req.body.checkout;
    newReservation.save(function(err) {
      if (err) {
        return next(err);
      } else {
         res.redirect('/');
      }
    });
  });
});


module.exports = router;
