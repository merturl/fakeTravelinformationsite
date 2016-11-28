var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, index: true}, //제목
  content: {type: String, trim: true}, //내용
  createdAt: {type: Date, default: Date.now},//작성일
  address: {type: String, trim: true},//주소
  charge: {type: Number, default: 0},//숙소요금
  infrastructure: {type: String},//주요시설
  facility: {type: String},//편의시설
  rule: {type: String},//이용규칙
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Host = mongoose.model('Host', schema);

module.exports = Host;
