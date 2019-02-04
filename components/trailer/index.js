var html = require('choo/html')
var { pluck } = require('../base')

module.exports = trailer

function trailer (props, children) {
  var src = props.src
  var attrs = pluck(props, 'width', 'height', 'srcset', 'sizes', 'alt')
  attrs.alt = attrs.alt || props.title || ''

  return html`
    <div class="Trailer">
      ${props.src ? html`<img ${attrs} class="Trailer-background" src="${src}" />` : null}
      <div class="Trailer-content">${children}</div>
    </div>
  `
}
