#!/usr/bin/env node

const
express = require('express'),
path = require('path'),
BrowserID = require('../lib/browserid');

var exampleServer = express.createServer();

exampleServer
  .use(express.logger({ format: 'dev' }))
  .use(express.static(path.join(__dirname, ".")))
  .use(express.bodyParser());

var localOrigin;

/* In this example, we make it possible to authenticate through two 
 * providers: the real browserid, and mockmyid, which will issue an
 * assertion for any mockmyid.com email address.
 */
var options = {issuers: ['browserid.org', 'mockmyid.com']};
var browserid = new BrowserID(options);

exampleServer.post('/auth', function(req, res, next) {
  if (!req.body || !req.body.assertion) {
    res.writeHead(400);
    res.end();
  } else {
    browserid.verify({
      audience: localOrigin,
      assertion: req.body.assertion
    }, function(err, r) {
      if (err) {
        console.error(err);
        res.writeHead(500);
        res.write(err);
        res.end();
      } else {
        res.write(JSON.stringify(r));
        res.end();
      }
    });
  }
});

exampleServer.listen(
  process.env['PORT'] || 8080,
  process.env['HOST'] || "127.0.0.1",
  function() {
    var addy = exampleServer.address();
    localOrigin = 'http://' + addy.address + ":" + addy.port;
    console.log("running on", localOrigin);
  });
