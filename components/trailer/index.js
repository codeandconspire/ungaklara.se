var html = require('choo/html')
var { pluck } = require('../base')

module.exports = trailer

function trailer (props, content, children) {
  var src = props.src
  var attrs = pluck(props, 'width', 'height', 'srcset', 'sizes', 'alt')
  attrs.alt = attrs.alt || props.title || ''

  return html`
    <div class="Trailer">
      ${props.src ? html`<img ${attrs} class="Trailer-background" src="${src}" />` : null}
      <div class="u-container">
        <div class="Trailer-content">${content}</div>
        <div class="Trailer-children">
          ${children}
        </div>
      </div>
    </div>
  `
}
