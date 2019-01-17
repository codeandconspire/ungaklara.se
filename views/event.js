var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var intro = require('../components/intro')
var { asText, resolve } = require('../components/base')
var { serialize } = require('../components/text/serialize')

module.exports = view(event)

function event (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getByUID('event', state.params.event, (err, doc) => {
          if (err) throw err
          if (!doc) return intro.loading({ badge: true, image: true })
          return html`
            <div>
              ${intro({
                badge: [doc.data.category, doc.data.subheading].filter(Boolean).join(' – '),
                title: asText(doc.data.title),
                text: asElement(doc.data.description, resolve, serialize),
                image: doc.data.image.url ? {
                  alt: doc.data.image.alt,
                  src: doc.data.image.url,
                  width: doc.data.image.dimensions.width,
                  height: doc.data.image.dimensions.height
                } : null
              })}
            </div>
          `
        })}
      </div>
    </main>
  `
}
