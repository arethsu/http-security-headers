const path = require('path');
const fs = require('fs');
const http = require('http');

const express = require('express');
const logger = require('morgan');

// let helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Add middleware
// TODO: Research different API authentication methods (OAuth?)
app.use(logger('dev')); // Logger with nice colored terminal output
app.use(cookieParser('this is a secret')); // Cookie parser with secret
app.use(bodyParser.json()); // Body parser for JSON
app.use(bodyParser.urlencoded({ extended: true })); // Body parser for URL encoded data
app.use(express.static('public')); // Static content server

// Add security headers
app.use((req, res, next) => {
  // Test SSL and headers using a website tester
  // Read more: https://www.ssllabs.com/ssltest/
  //            https://securityheaders.io/
  //            https://mozilla.github.io/http-observatory-website/

  // Get a valid SSL certificate from a CA
  // Read more: https://letsencrypt.org/
  //            https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https

  // Don't forget about the CAA DNS record
  // Add CAA DNS records with CAs allowed to issue certificates for the domain
  // Read more: https://sslmate.com/caa/
  //            https://tools.ietf.org/html/rfc6844
  // Record: arethsu.se. CAA 0 issue "letsencrypt.org"
  //         arethsu.se. CAA 0 iodef "mailto:user@test.com"

  // Enforce HTTPS by telling browsers to only use HTTPS
  // The current header tells browsers to enforce HTTPS for the current domain and its subdomains for 365 days
  // Most popular browsers embed a hardcoded list of submitted HTTPS domains. This is done to prevent browsers from
  // connecting to the server over HTTP at first contact, since we could be hijacked
  // Read more: https://tools.ietf.org/html/rfc6797
  //            https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  //            https://hstspreload.org/
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Read more: https://www.w3.org/TR/cors/
  //            https://en.wikipedia.org/wiki/Same-origin_policy
  //            https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
  // https://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/
  // https://www.html5rocks.com/en/tutorials/cors/
  // https://www.youtube.com/watch?v=dpBNpBJa3wk
  // https://www.youtube.com/watch?v=829ZO-bAvPA
  // https://www.youtube.com/watch?v=rlnhiwN8AnU
  // https://www.youtube.com/watch?v=stvCHJZq5MI
  // https://www.youtube.com/watch?v=Ave4jGlwAsY
  // https://www.youtube.com/watch?v=fPEVMKEtYoE
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Describe and whitelist sources of trusted content
  // The current header tells browsers to only load content from the host domain
  // CSP is a newer header not supported in older browsers (use other headers for fallback, such as X-Frame-Options and X-XSS-Protection)
  // Read more: https://www.w3.org/TR/CSP/
  //            https://developers.google.com/web/fundamentals/security/csp/
  //            https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  //            https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
  //            https://www.owasp.org/index.php/Content_Security_Policy_Cheat_Sheet
  res.header('Content-Security-Policy', "default-src 'self'");

  // Prevent browsers from loading pages in frames, iframes, and objects
  // The current header tells browsers not to load pages from either other domains or the same domain
  // Read more: https://tools.ietf.org/html/rfc7034
  //            https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  //            https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet
  res.header('X-Frame-Options', 'DENY');

  // Tell browsers that the content type header is correct and should not be changed (only applies to script and style types)
  // Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  res.header('X-Content-Type-Options', 'nosniff');

  // Requests will lack the referrer header
  // Read more: https://www.w3.org/TR/referrer-policy/
  //            https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  res.header('Referrer-Policy', 'no-referrer');

  next();
});

// Send error in case of error
// TODO: Add proper logging
app.use((err, req, res, next) => {
    console.error(err.message);
    console.error(err.stack);
    res.sendStatus(500);
});

app.get('/', (req, res) => {
  res.send('hello');
});


// Start server
// TODO: Get parameters from the terminal, such as address and port
const address = process.env.ADDRESS || '0.0.0.0';
const port = process.env.PORT || '3000';
app.listen(port, address, () => console.log('API running on ' + address + ':' + port));
