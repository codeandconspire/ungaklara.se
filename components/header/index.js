var html = require('choo/html')
var { i18n, resolve, asText } = require('../base')
var Component = require('choo/component')

var text = i18n()

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.prismic = state.prismic
    this.local = state.components[id] = { id }
  }

  update () {
    return true
  }

  createElement () {
    return html`
      <header class="Header u-container" id="${this.local.id}">
        <h2 class="u-hiddenVisually">${text`Navigation`}</h2>
        <nav>
          <a class="Header-logo" href="/" rel="home">${text`SITE_NAME`}</a>
          <ul class="Header-list">
            ${this.prismic.getSingle('website', function (err, doc) {
              if (err || !doc) return null
              return doc.data.menu.map(function (slice) {
                if (slice.slice_type !== 'link') return null
                return html`
                  <li class="u-inlineBlock">
                    <a class="Header-link" href="${resolve(slice.primary.link)}">
                      ${slice.primary.link_text || asText(slice.primary.link.data.title)}
                    </a>
                  </li>
                `
              }).filter(Boolean)
            })}
          </ul>
        </nav>
      </header>
    `
  }
}
