var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var crypto = require('crypto');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log("Hello")

  var link = new Link({ url: "http://google.com" });
  link.createCode(function(){
    link.save();
  });


  Link.find({ url: "http://google.com" }, function(err, links){
    console.log(links);
  });


});

var userSchema = mongoose.Schema({
    name: String,
    password: String
});

var linkSchema = mongoose.Schema({
    visits:  Number,
    url: String,
    title: String,
    baseURL: String,
    code: String
});

linkSchema.methods.createCode = function(cb){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  console.log(this);
  cb();
};

userSchema.methods.hashPassword = function (cb) {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      cb();
    });
};

userSchema.methods.comparePassword = function (attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Link = mongoose.model('Link', linkSchema);
