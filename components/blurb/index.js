var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

module.exports = blurb

function blurb (props) {
  var attrs
  if (props.link) {
    attrs = { href: props.link.href }
    if (props.external) {
      attrs.target = '_blank'
      attrs.rel = 'noopener noreferrer'
    }
  }
  return html`
    <div class="Blurb">
      ${props.heading ? html`<h2 class="u-spaceB1 u-textLabel">${props.heading}</h2>` : null}
      <div class="Blurb-body">
        <div class="Text Text--large">
          ${props.body}
        </div>
      </div>
      ${attrs ? html`
        <a class="Blurb-link" ${attrs}>${props.link.text || text`Read more`}</a>
      ` : null}
    </div>
  `
}
