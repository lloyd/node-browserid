// a trivial keyfetcher and key cache
const jwk = require("jwcrypto/jwk");

const https = require('https');

const KEY_EXPIRATION = 60 * 1000;

var keys = {
};

module.exports = function(domain, cb)
{
  setTimeout(function() {
    if (typeof domain !== 'string') cb('domain argument missing');
    if (keys[domain]) {
      if ((new Date() - keys[domain].fetched_at) > KEY_EXPIRATION)
        delete keys[domain];
      if (keys[domain]) return cb(null, keys[domain].publicKey);
    } 

    https.get({
      host: domain,
      path: '/.well-known/browserid',
    }, function(res) {
      var data = "";
      res.on('data', function(chunk) {
        data += chunk;
      }).on('end', function () {
        // pull the public-key field out of the response
        // and re-stringify it for jwk
        var key;
        try {
          data = JSON.parse(data);
          key = JSON.stringify(data["public-key"]);
        } catch(e) {
          return cb("error retrieving public key for '"
                    + domain + "': " + e.toString());
        }

        // parse the public key
        try {
          keys[domain] = {
            publicKey: jwk.PublicKey.deserialize(key),
            fetched_at: new Date()
          };
        } catch(e) {
          return cb("error parsing public key for '"
                    + domain + "': " + e.toString());
        }

        return cb(null, keys[domain].publicKey);
      });
    }).on('error', function(err) {
      cb(err);
    });
  }, 0);
};
