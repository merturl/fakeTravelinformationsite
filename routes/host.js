var express = require('express');
var Host = require('../models/Host');//Post를 사용
var Comment = require('../models/comment');
var router = express.Router();


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
    Post.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/host/' + req.params.id);
    });
  });
});
//url이 /posts에 들어온 경우 gusestbook 디렉토리의 posts/index 파일을 렌더링 해준다.
router.get('/', function(req, res, next) {
  // Post.find({}, function(err, posts) {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.render('posts/index', {pagination: [{numPosts: 10,}], posts: posts});
  // });
  res.render('index');
});

//url이 /posts/new에 들어올시 gusestbook 디렉토리의 posts/edit 파일을 렌더링해 게시판 작성 페이지를 나타낸다.
router.get('/new', function(req, res, next) {
  res.render('posts/edit', {post: Post});
});

// //url이 /posts/id에 들어올시 gusestbook 디렉토리의 posts/show 파일을 렌더링해 해당 id에 맞는 글의 상세내용을 보여줌.
// router.get('/:id', function(req, res, next) {
//   Host.findById(req.params.id, function(err, host) {
//     if (err) {
//       return next(err);
//     }
//     //글이 클릭 될시 read값이 증가(조회수가 증가)
//     host.read++;
//     host.save();
//     res.render('host/show', {host: post});
//   });
// });


//url이 /posts/id/edit에 들어올시  gusestbook 디렉토리의 posts/edit 파일을 렌더링해 해당 id에 맞는 글을 수정 하는 페이지를 보여줌.
router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

//url의 /posts/id(수정 버튼 클릭시 들어오는 url주소) 
 router.put('/:id', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});//validaform에서 null이 아닌 값이 전달될시 redirect(back) 함
  if (err) {
    return res.redirect('back');
  }
  //DB의 Post에서 Id를 찾아 비밀번호를 비교 맞을시 해당 Id의 내용들을 수정 하고 저장함.
  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      return res.redirect('back');
    }
    //기존에 입력된 비밀 번호와 폼에 입력된 비밀번호가 같아야지만 수정 가능.
    if(post.password !== req.body.password){
      return res.redirect('back');
    }
    post.email = req.body.email;
    post.title = req.body.title;
    post.content = req.body.content;
    post.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts');
    });
  });
});

//해당 id의 게시글을 삭제
router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts');
  });
});

//글쓰기 버튼 클릭시 들어 오는 주소로 새 글을 작성 해주는 일을 처리 
 router.post('/', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    //res.send(err);
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
    });
    newHost.content = req.body.content;
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