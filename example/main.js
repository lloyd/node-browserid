#!/usr/bin/env node

const
express = require('express'),
path = require('path');

var exampleServer = express.createServer();

exampleServer.use(express.logger({ format: 'dev' }));

exampleServer.use(express.static(path.join(__dirname, ".")));

exampleServer.use(express.bodyParser());

exampleServer.post('/auth', function(req, res, next) {
  console.log("got auth: ", req.body);
  res.writeHead(403);
  res.end();
});

exampleServer.listen(
  process.env['PORT'] || 8080,
  process.env['HOST'] || "127.0.0.1",
  function() {
    var addy = exampleServer.address();
    console.log("running on http://" + addy.address + ":" + addy.port);
  });
