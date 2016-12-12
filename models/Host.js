var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, index: true}, //제목
  content: {type: String, trim: true}, //내용
  createdAt: {type: Date, default: Date.now},//작성일
  city: {type: String, trim: true}, // 도시
  address: {type: String, trim: true},//주소
  charge: {type: Number, default: 0},//숙소 요금
  numComment: {type: Number, default: 0},//댓글
  facility: {type: String},//편의시설
  rule: {type: String},//이용규칙
  reservation: {type:String, default:"예약가능"},
  read: {type: Number, default: 0},//조회수
  persons: {type: Number, trim: true},
  email: {type: String, required: true, index: true, trim: true},
  user: {type: Schema.Types.ObjectId, index: true, required: true},
  checkin: {type: Date},//체크인
  checkout: {type: Date},//체크아웃
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Host = mongoose.model('Host', schema);

module.exports = Host;
