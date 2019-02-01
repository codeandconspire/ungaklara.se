var html = require('choo/html')

var IMG_ATTRS = ['width', 'height', 'srcset', 'sizes', 'src', 'alt']

module.exports = framed
module.exports.loading = loading

function framed (opts) {
  var format = opts.format || 'rectangular'
  var attrs = Object.keys(opts)
    .filter((key) => IMG_ATTRS.includes)
    .sort((a, b) => IMG_ATTRS.indexOf(b) - IMG_ATTRS.indexOf(a))
    .reduce(function (obj, key) {
      obj[key] = opts[key]
      return obj
    }, {})

  return html`
    <div class="Framed Framed--${format}">
      <img class="Framed-image" ${attrs} />
    </div>
  `
}

function loading (opts = {}) {
  var format = opts.format || 'rectangular'
  return html`
    <div class="Framed Framed--${format} is-loading">
      <div class="Framed-image"></div>
    </div>
  `
}
