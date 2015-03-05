var configuration =
{ development:
  {
    port: 3000,
    mongoCredentials: 'mongodb://localhost/test'
  },
  production:
  {
    port: 80,
    mongoCredentials: 'mongodb://deploy-shortlyDB:AfKiZYWmF7q.r.Qj2YUl8OFgCcgaI0wCCwV2VggQ6e0-@ds050077.mongolab.com:50077/deploy-shortlyDB' //<-- Insert MS mongo server URL/pass
  }
};

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return configuration[node_env];
};

