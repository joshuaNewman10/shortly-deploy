var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var env = require("../common.js").config();

mongoose.connect(env.mongoCredentials);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var userSchema = mongoose.Schema({
    username: String,
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


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({url: uri}, function(err, links) {
    if (links.length > 0) {
      res.send(200, links[0]); //?
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var link = new Link({url: uri, title: title, visits: 0, baseURL: req.headers.origin});
        link.createCode(function(){
          link.save(function() {
            res.send(200, link);
          });
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.find({username: username}, function(err, users) {
    if (users.length === 0) {
      res.redirect('/login');
    } else {
      users[0].comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, users[0]);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.find({ username: username }, function(err, users) {
    if( users.length === 0) {
      var newUser = new User({username: username, password: password});
      newUser.hashPassword(function() {
        newUser.save(function(err, newUser) {
          util.createSession(req, res, newUser);
        });
      });
    } else {
      console.log('Account already exists');
      res.direct('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function(err, links) {
    if ( links.length === 0 ) {
      res.redirect('/');
    } else {
      links[0].visits++;
      links[0].save(function() {
        res.redirect(links[0].url);
      });
    }
  });
};
