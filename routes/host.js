var express = require('express');
var Host = require('../models/Host');//Post를 사용
var Comment = require('../models/Comment');
var User = require('../models/User');
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
  var city = form.city || "";
  var address = form.address || "";
  var charge = form.charge || 0;

    city = city.trim();
    address = address.trim();

    if (!title) {
        return '이름을 입력해주세요.';
    }
    if(!city){
        return '도시를 입력해주세요.';
    }
    if(!address){
        return '주소를 입력해주세요.';
    }
    if(!charge){
        return '비용을 입력해주세요.';
    }
  return null;
}



router.get('/myhosting', needAuth, function(req, res, next) {
  Host.find({user: req.user.id}, function(err, hosts) {
    if (err) {
      return next(err);
    }
    res.render('host/index', {hosts: hosts});
  });
});

router.get('/:id', function(req, res, next) {
  Host.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    Comment.find({post: post.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
      post.read++;
      post.save();
      res.render('host/show', {host: post, comments: comments});
    });
  });
});

router.post('/:id/comments', function(req, res, next) {
  var comment = new Comment({
    post: req.params.id,
    email: req.body.email,
    content: req.body.content
  });

  comment.save(function(err) {
    if (err) {
      return next(err);
    }
    Host.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/host/' + req.params.id);
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Host.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/host/myhosting');
  });
});

router.get('/', function(req, res, next) {
  res.render('edit');
});

router.get('/:id/edit', function(req, res, next) {
  Host.findById(req.params.id, function(err, host) {
    if (err) {
      return next(err);
    }
    res.render('host/edit', {host: host});
  });
});

 router.put('/:id', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});//validaform에서 null이 아닌 값이 전달될시 redirect(back) 함
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  Host.findById({_id: req.params.id}, function(err, host) {
    if (err) {
      return next(err);
    }
    if (!host) {
      return res.redirect('back');
    }
    host.title= req.body.title;
    host.content = req.body.content || "내용 없음";
    host.city = req.body.city;
    host.charge = req.body.charge;
    host.address = req.body.address;
    host.facility = req.body.facility || "없음";
    host.rule = req.body.rule || "없음";
    host.persons = req.body.persons;
    host.checkin = req.body.checkin;
    host.checkout = req.body.checkout;
    host.reservation = "예약가능";
    host.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});
//글쓰기 버튼 클릭시 들어 오는 주소로 새 글을 작성 해주는 일을 처리 
 router.post('/', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
    //새로운 스키마 작성 Model에 require 된 값들은 New할시 생성해주어야 함.
    var newHost = new Host({
      title: req.body.title,
      user: req.user.id,
      email: req.user.email,
    });
    newHost.content = req.body.content || "내용 없음";
    newHost.city = req.body.city;
    newHost.charge = req.body.charge;
    newHost.address = req.body.address;
    newHost.facility = req.body.facility || "없음";
    newHost.rule = req.body.rule || "없음";
    newHost.persons = req.body.persons;
    newHost.checkin = req.body.checkin;
    newHost.checkout = req.body.checkout;
    newHost.save(function(err) {
      if (err) {
        return next(err);
      } else {
         res.redirect('/');
      }
  });
});
module.exports = router;