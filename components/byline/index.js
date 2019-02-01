var html = require('choo/html')
var framed = require('../framed')
var { hexToRgb } = require('../base')

module.exports = byline

function byline (props) {
  var color = props.color ? hexToRgb(props.color) : 'inherit'

  return html`
    <div class="Byline">
      ${props.image ? html`
        <div class="Byline-image" style="--theme-color: ${color}">
          ${framed(Object.assign({ format: 'ellipse' }, props.image))}
        </div>
      ` : null}
      <div class="Byline-body">
        <div class="Text">
          ${props.heading ? html`<h3 class="u-spaceV2">${props.heading}</h3>` : null}
          ${props.body}
        </div>
      </div>
    </div>
  `
}
