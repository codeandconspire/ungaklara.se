var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var grid = require('../components/grid')
var intro = require('../components/intro')
var framed = require('../components/framed')
var button = require('../components/button')
var Masonry = require('../components/masonry')
var factsBox = require('../components/facts-box')
var Blockquote = require('../components/text/blockquote')
var { asText, resolve, i18n, hexToRgb } = require('../components/base')
var { serialize } = require('../components/text/serialize')

var text = i18n()

module.exports = view(event, meta)

function event (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getByUID('event', state.params.event, (err, doc) => {
          if (err) throw err
          if (!doc) return intro.loading({ badge: true, image: true })

          var attrs = {}
          if (doc.data.theme) {
            attrs.style = `--theme-color: ${hexToRgb(doc.data.theme)}`
          }

          return html`
            <div ${attrs}>
              <div class="u-spaceB8">
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
              ${grid([
                Object.assign(() => html`
                  <div>
                    ${framed(Object.assign({
                      src: doc.data.poster.url
                    }, doc.data.poster.dimensions))}
                  </div>
                `, { size: { md: '1of4' } }),
                Object.assign(() => html`
                  <div>
                    <div class="Text Text--large u-spaceV5">
                      ${asElement(doc.data.about, resolve, serialize)}
                    </div>
                    ${button({ text: text`Show dates`, href: '/', class: 'u-spaceR1' })}
                    ${button({ text: text`Buy ticket`, href: '/', primary: true })}
                  </div>
                `, { size: { md: '3of4' } })
              ])}
              <div class="u-spaceV4">
                ${factsBox(doc.data.details)}
              </div>
              <div class="u-spaceV4">
                ${state.cache(Masonry, doc.id + '-media').render(doc.data.media.map(media).filter(Boolean))}
              </div>
            </div>
          `
        })}
      </div>
    </main>
  `

  function media (slice, index) {
    switch (slice.slice_type) {
      case 'image': {
        var attrs = {
          alt: slice.primary.image.alt || '',
          src: slice.primary.image.url,
          width: slice.primary.image.dimensions.width,
          height: slice.primary.image.dimensions.height
        }
        return html`
          <figure class="Text u-spaceV3">
            <img ${attrs} />
            ${slice.primary.image.copyright ? html`
              <figcaption class="Text-meta">${slice.primary.image.copyright}</figcaption>
            ` : null}
          </figure>
        `
      }
      case 'quote': {
        var blockquote = state.cache(Blockquote, `event-media-${index}`)
        return html`
          <div class="u-spaceV3">
            ${blockquote.render(
              asElement(slice.primary.text, resolve, serialize),
              asElement(slice.primary.cite, resolve, serialize)
            )}
          </div>
        `
      }
      default: return null
    }
  }
}

function meta (state) {
  return state.prismic.getByUID('event', state.params.event, (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.share_image.url ? doc.data.share_image : doc.data.image
    if (image.url) {
      Object.assign(props, {
        'og:image': image.url,
        'og:image:width': image.dimensions.width,
        'og:image:height': image.dimensions.height
      })
    }

    return props
  })
}
