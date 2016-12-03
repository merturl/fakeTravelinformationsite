var express = require('express');
var Host = require('../models/Host');//Post를 사용
var Comment = require('../models/Comment');
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


router.get('/:id', function(req, res, next) {
  Host.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    Comment.find({post: post.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
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
      req.flash('suceess', req.params.id);
      res.redirect('/host/' + req.params.id);
    });
  });
});

router.get('/', function(req, res, next) {
  res.render('index');
});

//글쓰기 버튼 클릭시 들어 오는 주소로 새 글을 작성 해주는 일을 처리 
 router.post('/', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    res.send(err);
    return res.redirect('back');
  }
  // Post.findOne({email: req.body.email}, function(err, post) { 중복된 이메일 사용 불가.
  //   if (err) {
  //     return next(err);
  // //   }
  // if (post) {
  //   res.redirect('back');
  // }
    //새로운 스키마 작성 Model에 require 된 값들은 New할시 생성해주어야 함.
    var newHost = new Host({
      title: req.body.title,
      user: req.user.id,
    });
    newHost.content = req.body.content;
    newHost.charge = req.body.charge;
    newHost.address = req.body.address;
    newHost.save(function(err) {
      if (err) {
        return next(err);
      } else {
         res.redirect('/');
      }
  });
 
});

module.exports = router;