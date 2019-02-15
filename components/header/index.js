var html = require('choo/html')
var { i18n, resolve, asText, className } = require('../base')
var Component = require('choo/component')

var text = i18n()

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.prismic = state.prismic
    this.href = state.href
    this.local = state.components[id] = { id }
  }

  update (href) {
    this.href = href
    return true
  }

  createElement () {
    var match = this.href.match(/^\/([^/]+\/)/)
    var current = this.href
    if (match) {
      current = '/' + match[1].substring(0, match[1].length - 1)
    }
    
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
                var href = resolve(slice.primary.link)
                return html`
                  <li class="u-inlineBlock">
                    <a class=${className('Header-link', { 'is-current': current === href })}" href="${href}">
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
