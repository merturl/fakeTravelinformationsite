var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, index: true}, //제목
  post: {type: Schema.Types.ObjectId, index: true, required: true, trim: true},//포스트 번호
  user: {type: Schema.Types.ObjectId, index: true, required: true},//예약자 유저
  hostuser: {type: Schema.Types.ObjectId, index: true, required: true},//관리자 유저
  email: {type: String, required: true, trim: true},//예약자 이메일
  hostemail: {type: String, required: true, trim: true},//예약자 이메일
  persons: {type: Number, default: 1},//인원
  checkin: {type: Date},//체크인
  checkout: {type: Date},//체크아웃
  charge: {type: Number, default: 0},//숙소 요금
  reserveState:{type: String, default: "예약대기중"},
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Reservation = mongoose.model('Reservation', schema);

module.exports = Reservation;
