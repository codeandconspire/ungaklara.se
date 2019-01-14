var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

module.exports = header

function header (view, meta) {
  return html`
    <header class="Header">
      <nav class="u-container">
        <h2 class="u-hiddenVisually">${text`Navigation`}</h2>
        <ul>…</ul>
      </nav>
    </header>
  `
}
