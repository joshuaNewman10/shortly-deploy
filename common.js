var configuration =
{ development:
  {
    port: 3000,
    mongoCredentials: 'mongodb://localhost/shortlydb'
  },
  production:
  {
    port: 80,
    mongoCredentials: process.env.CUSTOMCONNSTR_MONGOLAB_URI //<-- Insert MS mongo server URL/pass
  }
};

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return configuration[node_env];
};

// var port = process.env.PORT || 4568;
