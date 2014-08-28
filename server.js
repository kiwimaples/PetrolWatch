var express = require('express');
var filed = require('filed');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var st = require('st');
var mount = st({
  path: __dirname,
  index: 'index.html',
  cache: false
});
var FeedParser = require('feedparser');
var JSONStream = require('JSONStream');
var port = process.env.NODE_PORT || process.env.PORT || 3000;

app.get('/sample.json', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  fs.createReadStream(__dirname + '/sample.xml')
    .pipe(new FeedParser())
    .pipe(JSONStream.stringify())
    .pipe(res);
});

app.get('/bundle.js', function(req, res) {
  require('browserify')(__dirname + '/index.js').bundle().pipe(res);
});

app.get('/*', mount);

server.listen(port, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('server running at http://localhost:' + port);
});
