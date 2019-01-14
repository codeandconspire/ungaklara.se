var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

module.exports = footer

function footer (view, meta) {
  return html`
    <footer class="Footer">
      <div class="u-container">
        <nav>
          <h2 class="u-hiddenVisually">${text`Sitemap`}</h2>
          <ul>…</ul>
        </nav>

        <h2 class="u-hiddenVisually">${text`Website info`}</h2>
        …
      </div>
    </footer>
  `
}
