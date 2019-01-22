var html = require('choo/html')
var { loader } = require('../base')

module.exports = intro
module.exports.loading = loading

function intro (props) {
  return html`
    <div class="Intro">
      <div class="Intro-title">
        ${props.badge ? html`<span class="Intro-badge">${props.badge}</span>` : null}
        ${props.title}
      </div>
      <div class="Intro-text">${props.text}</div>
      ${props.image ? html`
        <img class="Intro-image" ${props.image}>
      ` : null}
    </div>
  `
}

function loading (opts = {}) {
  return html`
    <div class="Intro">
      <div class="Intro-title">
        ${opts.badge ? html`<span class="Intro-badge">${loader(4)}</span>` : null}
        ${loader(8)}
      </div>
      <div class="Intro-text">${loader(82)}</div>
      ${opts.image ? html`
        <div class="Intro-image">
          <div class="u-loading u-aspect16-9"></div>
        </div>
      ` : null}
    </div>
  `
}
