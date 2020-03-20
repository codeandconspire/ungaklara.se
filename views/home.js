var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var framed = require('../components/framed')
var intro = require('../components/intro')
var button = require('../components/button')
var jigsaw = require('../components/jigsaw')
var serialize = require('../components/text/serialize')
var { asText, resolve } = require('../components/base')
var { i18n } = require('../components/base')

var text = i18n()

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        console.log(doc)
        if (err) throw err
        if (!doc) {
          return jigsaw(
            intro.loading({ collapse: true }),
            null,
            framed.loading(),
            null,
            { alt: true }
          )
        }

        return html`
          <div>
            <header>
              ${jigsaw(
                intro({
                  collapse: true,
                  title: asText(doc.data.title),
                  text: asElement(doc.data.description, resolve, serialize)
                }),
                doc.data.cta ? html`
                  <div class="View-action">
                    ${button({ text: text`Read more`, href: resolve(doc.data.cta), primary: true })}
                  </div>
                ` : null
              )}
            </header>
          </div>
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getSingle('homepage', function (err, doc) {
    if (err) throw err
    if (!doc) return null

    var props = {
      'theme-color': doc.data.theme
    }

    return props
  })
}
