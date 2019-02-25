var html = require('choo/html')
var { pluck } = require('../base')

module.exports = trailer

function trailer (props, content, children) {
  var src = props.src
  var attrs = pluck(props, 'width', 'height', 'srcset', 'sizes', 'alt')
  attrs.alt = attrs.alt || props.title || ''

  return html`
    <div class="Trailer">
      <div class="Trailer-content">
        <div class="Trailer-background">
          ${props.src ? html`<img ${attrs} class="Trailer-image" src="${src}" />` : null}
        </div>
        <div class="u-container">
          ${content}
        </div>
      </div>
      ${children ? html`
        <div class="Trailer-children u-container">
          ${children}
        </div>
      ` : null}
    </div>
  `
}
