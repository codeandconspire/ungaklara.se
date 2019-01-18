var html = require('choo/html')
var { i18n, resolve, asText } = require('../base')
var Component = require('choo/component')

var text = i18n()

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.prismic = state.prismic
  }

  update () {
    return true
  }

  createElement () {
    return this.prismic.getSingle('website', function (err, doc) {
      if (err) throw err
      if (!doc) return html`<header></header>`

      return html`
        <header class="Header u-container">
          <h2 class="u-hiddenVisually">${text`Navigation`}</h2>
          <nav>
            <a class="Header-logo" href="/" rel="home">${text`SITE_NAME`}</a>
            <ul class="Header-list">
              ${doc.data.primary_pages.map((item) => html`
                <li class="u-inlineBlock"><a class="Header-link" href="${resolve(item.page)}">${asText(item.page.data.title)}</a></li>
              `)}
            </ul>
          </nav>
        </header>
      `
    })
  }
}
