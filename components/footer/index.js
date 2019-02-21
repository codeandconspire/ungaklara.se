var html = require('choo/html')
var { i18n, resolve, asText } = require('../base')
var Component = require('choo/component')

var text = i18n(require('./lang.json'))

module.exports = class Footer extends Component {
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
      <footer class="Footer u-container" id="${this.local.id}">
        ${this.prismic.getSingle('website', function (err, doc) {
          if (err || !doc) return null
          return html`
            <div>
              <div class="Footer-cols">
                ${doc.data.menu.map(function (slice) {
                  if (slice.slice_type !== 'link') return null
                  var root = resolve(slice.primary.link)
                  return html`
                    <div class="Footer-section">
                      <h3 class="Footer-title">
                        <a class="Footer-link" href="${root}">
                          ${slice.primary.link_text || asText(slice.primary.link.data.title)}
                        </a>
                      </h3>
                      <ul>
                        ${slice.items.map(function (item) {
                          var link = item.link
                          if ((!link.id && !link.url) || link.isBroken) return null
                          var url = resolve(link)
                          if (item.link.link_type === 'Document' && item.link.type === 'page') {
                            url = root + url
                          }
                          return html`
                            <li class="Footer-item">
                              <a class="Footer-link" href="${url}">${item.link_text || asText(link.data.title)}</a>
                            </li>
                          `
                        }).filter(Boolean)}
                      </ul>
                    </div>
                  `
                }).filter(Boolean)}
              </div>

              <div class="Footer-cols">
                <div class="Footer-section">
                  <h3 class="Footer-title">${text`Contact`}</h3>
                  <ul>
                    ${doc.data.phone ? html`
                      <li class="Footer-item">
                        <a class="Footer-link" href="tel:${doc.data.phone}">${doc.data.phone}</a>
                      </li>
                    ` : null}
                    ${doc.data.email ? html`
                      <li class="Footer-item">
                        <a class="Footer-link" href="mailto:${doc.data.email}">${doc.data.email}</a>
                      </li>
                    ` : null}
                    ${doc.data.contact_page.id && !doc.data.contact_page.isBroken ? html`
                      <li class="Footer-item">
                        <a class="Footer-link" href="${resolve(doc.data.contact_page)}">${text`Staff`}</a>
                      </li>
                    ` : null}
                  </ul>
                </div>

                <div class="Footer-section">
                  <h3 class="Footer-title">${text`Find us`}</h3>
                  <address class="Footer-item u-textNowrap">${addLineBreak(doc.data.address)}</address>
                </div>

                <div class="Footer-section">
                  <h3 class="Footer-title">${text`Follow us`}</h3>
                  <ul>
                    ${doc.data.platforms.map((data) => html`
                      <li class="Footer-item">
                        <a class="Footer-link" target="_blank" href="${data.link.url}">${data.platform}</a>
                      </li>
                    `)}
                  </ul>
                </div>

                <div class="Footer-section">
                  <h3 class="Footer-title">${text`Boring pages`}</h3>
                  <ul>
                    ${doc.data.links.map(function (data) {
                      var attrs = {
                        class: 'Footer-link',
                        href: data.link.url || resolve(data.link)
                      }
                      if (data.link.link_type === 'Web') {
                        attrs.target = '_blank'
                        attrs.rel = 'noopener noreferrer'
                      }
                      return html`
                        <li class="Footer-item">
                          <a ${attrs}>${data.text}</a>
                        </li>
                      `
                    })}
                  </ul>
                </div>
              </div>
            </div>
          `
        })}
        <div class="u-sizeFull u-textCenter">
          <a class="Footer-logo" href="/" rel="home">U<span class="Footer-extra">nga </span>K<span class="Footer-extra">lara</span></a>
        </div>
      </footer>
    `
  }
}

function addLineBreak (text) {
  return text.split('\n').reduce(function (rows, row, index, list) {
    rows.push(row, index < list.length - 1 ? html`<br />` : null)
    return rows
  }, [])
}
