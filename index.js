const port = process.env.PORT || 4040;
const ipAddress = process.env.IP_ADDRESS;
const http = require('http');
const handleHttpServerErrors = require('./utils/handleHttpServerErrors');
const router = require('./routes/api');

var express = require('express'),
    app     = express();

app.set('port', port);
app.set('ipaddr',ipAddress);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*
* Create HTTP server.
*/
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Trading View Adapter started on port -> ${server.address().port}, node-env -> ${process.env.NODE_ENV}`);
});
server.on('error', handleHttpServerErrors);

app.use('/', router);

