var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true, index: true, trim: true}, //이메일
  title: {type: String, trim: true}, //제목
  content: {type: String, trim: true},//내용
  createdAt: {type: Date, default: Date.now},//작성일
  read: {type: Number, default: 0},//조회수
  password: {type: String},//비밀번호
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
