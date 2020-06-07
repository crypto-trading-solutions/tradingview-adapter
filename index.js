const port = process.env.PORT;
const ipAddress = process.env.IP_ADDRESS;

var express = require('express'),
    app     = express();

app.set('port', port);
app.set('ipaddr',ipAddress);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(port, function () {
    console.log('Trading View Adapter started');
});


app.get('/', function (req, res) {
  res.send('hello');
});

app.post('/alert', function (req, res) {
  let body =req.body; // JSON.parse(JSON.stringif());
  console.log(body);
  console.log(body.info);
  res.send({ status: 'SUCCESS' });
});


