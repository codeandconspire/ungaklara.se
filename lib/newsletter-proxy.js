var https = require('https')

const ENDPOINT = 'https://api.getanewsletter.com/v3/contacts/'

module.exports = middleware

// proxy requests through newsletter platform endpoint
// (obj, str) -> Promise
function middleware (body) {
  return new Promise(function (resolve, reject) {
    var data = {
      email: body.email,
      lists: [{ hash: process.env.GETANEWSLETTER_LIST }]
    }

    var opts = Object.assign({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${process.env.GETANEWSLETTER_TOKEN}`
      }
    })

    var req = https.request(ENDPOINT, opts, function onresponse (res) {
      if (res.statusCode >= 400) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      res.on('error', reject)
      resolve(res)
    })
    req.on('error', reject)
    req.write(JSON.stringify(data))
    req.end()
  })
}
