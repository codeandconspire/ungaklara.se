var html = require('choo/html')
var { i18n, resolve, asText } = require('../base')
var Component = require('choo/component')

var text = i18n(require('./lang.json'))

module.exports = class Footer extends Component {
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
      if (!doc) return html`<footer></footer>`

      return html`
        <footer class="Footer u-container">
          <div class="Footer-cols">
            ${doc.data.primary_pages.map((item) => html`
              <div class="Footer-section">
                <h3 class="Footer-title"><a class="Footer-link" href="${resolve(item.page)}">${asText(item.page.data.title)}</a></h3>
              </div>
            `)}
          </div>

          <div class="Footer-cols">
            <div class="Footer-section">
              <h3 class="Footer-title">${text`Call us`}</h3>
              <div class="Footer-item">
                <a class="Footer-link" href="tel:${doc.data.phone}">${doc.data.phone}</a>
              </div>
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
                ${doc.data.links.map((data) => html`
                  <li class="Footer-item">
                    <a class="Footer-link" target="_blank" rel="noopener noreferer" href="${data.link.url}">${data.text}</a>
                  </li>
                `)}
              </ul>
            </div>
          </div>

          <div class="u-sizeFull u-textCenter">
            <a class="Footer-logo" href="/" rel="home">U<span class="Footer-extra">nga </span>K<span class="Footer-extra">lara</span></a>
          </div>
        </footer>
      `
    })
  }
}

function addLineBreak (text) {
  return text.split('\n').reduce(function (rows, row, index, list) {
    rows.push(row, index < list.length - 1 ? html`<br />` : null)
    return rows
  }, [])
}
