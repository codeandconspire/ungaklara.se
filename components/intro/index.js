var html = require('choo/html')
var { loading } = require('../base')

module.exports = intro
module.exports.loading = introLoading

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

function introLoading (opts, light = false) {
  return html`
    <div class="Intro">
      <div class="Intro-title">
        ${opts.badge ? html`<span class="Intro-badge">${loading(4)}</span>` : null}
        ${loading(8)}
      </div>
      <div class="Intro-text">${loading(82)}</div>
      ${opts.image ? html`
        <div class="Intro-image">
          <div class="u-loading u-aspect16-9"></div>
        </div>
      ` : null}
    </div>
  `
}
