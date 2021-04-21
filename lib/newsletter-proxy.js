var https = require('https')
var querystring = require('querystring')

module.exports = middleware

// proxy requests through newsletter platform endpoint
// (obj, str) -> Promise
function middleware (body, url) {
  return new Promise(function (resolve, reject) {
    var data = querystring.stringify(body)
    var opts = Object.assign({
      method: 'POST',
      headers: {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    var req = https.request(url, opts, function onresponse (res) {
      if (res.statusCode >= 400) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      res.on('error', reject)
      resolve(res)
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}
