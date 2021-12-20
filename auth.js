const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// define client - connected to Auth0 account
// putting return value of jsksClient in client
// from jsonWebToken docs
// jwks-rsa has to be added seperately

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

// from: https://www.npmjs.com/package/jsonwebtoken
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}


// verify user on route

function verifyUser(req, callback) {
  try {
    // define token from req header
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    // from jsonWebToken docs
    jwt.verify(token, getKey, {}, callback); 
  } catch (e) {
    callback('Not Authorized');
  }
}

module.exports = verifyUser;