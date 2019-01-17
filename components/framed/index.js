var html = require('choo/html')

var IMG_ATTRS = ['width', 'height', 'srcset', 'sizes', 'src', 'alt']

module.exports = framed

function framed (opts) {
  var attrs = Object.keys(opts)
    .filter((key) => IMG_ATTRS.includes)
    .sort((a, b) => IMG_ATTRS.indexOf(b) - IMG_ATTRS.indexOf(a))
    .reduce(function (obj, key) {
      obj[key] = opts[key]
      return obj
    }, {})

  return html`
    <div class="Framed">
      <img class="Framed-image" ${attrs} />
    </div>
  `
}
