var html = require('choo/html')
var { loader } = require('../base')

module.exports = intro
module.exports.loading = loading

function intro (props) {
  var slot = props.slot || null
  if (typeof slot === 'function') slot = slot()
  if (slot) slot = html`<div class="Intro-slot">${slot}</div>`
  return html`
    <div class="Intro ${props.collapse ? 'Intro--collapse' : ''} ${props.blurb ? 'Intro--blurb' : ''} ${props.adapt ? 'Intro--adapt' : ''}">
      ${slot}
      ${props.action && props.blurb ? html`<div class="u-container u-invisible"><hr />` : null}
      <div class="Intro-title">
        ${props.badge ? html`<span class="Intro-badge"><span class="u-textLabel">${props.badge}</span></span>` : null}
        ${props.title}
      </div>
      ${props.text ? html`<div class="Intro-text">${props.text}</div>` : null}
      ${props.image ? image(props.image) : null}
      ${props.action && props.blurb ? html`
        <div class="Intro-action">
          ${props.action}
        </div>
      ` : null}
    </div>
  `
}

// render image
// obj -> Element
function image (props) {
  if (props.width && props.height) {
    return html`
      <div class="Intro-container" style="--Intro-aspect: ${props.height / props.width};">
        <img class="Intro-image" ${props}>
      </div>
    `
  }
  return html`<img class="Intro-image" ${props}>`
}

function loading (opts = {}) {
  return html`
    <div class="Intro ${opts.collapse ? 'Intro--collapse' : ''}" ${opts.adapt ? 'Intro--adapt' : ''}>
      <div class="Intro-title">
        ${opts.badge ? html`<span class="Intro-badge"><span class="u-textLabel">${loader(4)}</span></span>` : null}
        ${loader(6)}
      </div>
      ${typeof opts.text === 'undefined' || opts.text ? html`<div class="Intro-text">${loader(82)}</div>` : null}
      ${opts.image ? html`
        <div class="Intro-image">
          <div class="u-loading u-aspect16-9"></div>
        </div>
      ` : null}
    </div>
  `
}
