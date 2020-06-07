var express = require('express'),
    app     = express(),
    port    = 80;


app.set('port', port);
app.set('ipaddr',"111.11.11.111");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(port, function () {
    console.log('App started');
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


