var html = require('choo/html')
var { loader } = require('../base')

module.exports = intro
module.exports.loading = loading

function intro (props) {
  return html`
    <div class="Intro ${props.collapse ? 'Intro--collapse' : ''}">
      <div class="Intro-title">
        ${props.badge ? html`<span class="Intro-badge"><span class="u-textLabel">${props.badge}</span></span>` : null}
        ${props.title}
      </div>
      ${props.text ? html`<div class="Intro-text">${props.text}</div>` : null}
      ${props.image ? html`
        <img class="Intro-image" ${props.image}>
      ` : null}
    </div>
  `
}

function loading (opts = {}) {
  return html`
    <div class="Intro ${opts.collapse ? 'Intro--collapse' : ''}">
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
