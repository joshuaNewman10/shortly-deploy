var app = require('./server-config.js');
var env = require('./common').config();
//mongodb://deploy-shortlyDB:AfKiZYWmF7q.r.Qj2YUl8OFgCcgaI0wCCwV2VggQ6e0-@ds050077.mongolab.com:50077/deploy-shortlyDB
var environment = process.env.NODE_ENV;
console.log(environment);
var port = process.env.port || 3000;
console.log(port);

app.listen(port);

console.log('Server now listening on port ' + port);
