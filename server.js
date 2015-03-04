var app = require('./server-config.js');
var env = require('./common').config();

var environment = process.env.NODE_ENV;
console.log(environment);
var port = process.env.port || 3000;
console.log(port);

app.listen(port);

console.log('Server now listening on port ' + port);
