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
  var persons = form.persons || "";
  var checkin = form.checkin || "";
  var checkout = form.checkout || "";

    if (!persons) {
        return '인원을 선택해주세요';
    }
    if(!checkin){
        return '체크인 날짜를 선택해주세요.';
    }
    if(!checkout){
        return '체크아웃 날짜를 선택해주세요.';
    }
    
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
    res.render('reserve/new', {post: post});
  });
});

router.get('/:id/edit', needAuth, function(req, res, next) {
  Reservation.findById(req.params.id, function(err, reserve) {
    if (err) {
      return next(err);
    }
    res.render('reserve/edit', {reserve: reserve});
  });
});


router.get('/', needAuth, function(req, res, next) {
  Reservation.find({user:req.user.id}, function(err, reservations) {
    if (err) {
      return next(err);
    }
        res.render('reserve/show', {reservations: reservations});
  });
});

router.get('/:id/approve', needAuth, function(req, res, next) {
  Reservation.find({post:req.params.id}, function(err, reservations) {
    if (err) {
      return next(err);
    }
        res.render('reserve/approve', {reservations: reservations});
  });
});

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
      title: post.title,
      post: req.params.id,
      user: req.user.id,
      hostuser: post.user,
      email: req.user.email,
      hostemail: post.email,
    });
    newReservation.persons = req.body.persons;
    newReservation.charge = post.charge;
    newReservation.checkin = req.body.checkin;
    newReservation.checkout = req.body.checkout;
    newReservation.save(function(err) {
      if (err) {
        return next(err);
      } else {
         req.flash('success', '예약이 완료 되었습니다.');
         res.redirect('/');
      }
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Reservation.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '예약 신청이 삭제되었습니다.');
    res.redirect('/reserve');
  });
});

router.put('/:id/edit', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});//validaform에서 null이 아닌 값이 전달될시 redirect(back) 함
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  //DB의 Post에서 Id를 찾아 비밀번호를 비교 맞을시 해당 Id의 내용들을 수정 하고 저장함.
  Reservation.findById({_id: req.params.id}, function(err, reserve) {
    if (err) {
      return next(err);
    }
    //기존에 입력된 비밀 번호와 폼에 입력된 비밀번호가 같아야지만 수정 가능.
    reserve.persons = req.body.persons;
    reserve.checkin = req.body.checkin;
    reserve.checkout = req.body.checkout;
    reserve.reserveState ="예약대기중";
    reserve.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/reserve');
    });
  });
});

router.put('/:id/approve', function(req, res, next) {
  //DB의 Post에서 Id를 찾아 비밀번호를 비교 맞을시 해당 Id의 내용들을 수정 하고 저장함.
  Reservation.findById({_id: req.params.id}, function(err, reserve) {
    if (err) {
      return next(err);
    }
    //기존에 입력된 비밀 번호와 폼에 입력된 비밀번호가 같아야지만 수정 가능.
    if(reserve.reserveState == "예약대기중"){
      reserve.reserveState ="예약승인";
    }
    reserve.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('back');
    });
  });
});

module.exports = router;
