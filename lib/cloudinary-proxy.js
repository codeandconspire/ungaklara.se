var https = require('https')
var cloudinary = require('cloudinary')

var AUTO_TRANSFORM = /\?(?:.+)?auto=([^&]+)/
var COMPRESS = /compress,?/

cloudinary.config({
  secure: true,
  cloud_name: 'dykmd8idd',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = imageproxy

function imageproxy (type, transform, uri) {
  if (type === 'fetch' && !/^(?:https?:)?\/\//.test(uri)) {
    uri = `https://unga-klara.cdn.prismic.io/unga-klara/${uri}`
  }

  if (AUTO_TRANSFORM.test(uri)) {
    uri = uri.replace(AUTO_TRANSFORM, (match) => match.replace(COMPRESS, ''))
  }

  return new Promise(function (resolve, reject) {
    var url
    if (process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET) {
      const opts = { type: type, sign_url: true }
      if (transform) opts.raw_transformation = transform
      url = cloudinary.url(uri, opts)
    } else {
      url = uri
    }

    var req = https.get(url, function onresponse (res) {
      if (res.statusCode >= 400) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      resolve(res)
    })
    req.on('error', reject)
    req.end()
  })
}
