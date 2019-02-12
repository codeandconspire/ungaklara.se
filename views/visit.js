var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var grid = require('../components/grid')
var blurb = require('../components/blurb')
var intro = require('../components/intro')
var framed = require('../components/framed')
var jigsaw = require('../components/jigsaw')
var reset = require('../components/text/reset')
var cap = require('../components/text/cap-heading')
var serialize = require('../components/text/serialize')
var { asText, resolve, srcset } = require('../components/base')

module.exports = view(visit, meta)

function visit (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getSingle('your_visit', function (err, doc) {
          if (err) throw err
          if (!doc) return intro.loading({ badge: true })
          return html`
            <div>
              ${jigsaw(
                intro({
                  collapse: true,
                  title: asText(doc.data.title),
                  badge: doc.data.subheading,
                  text: asElement(doc.data.description, resolve, serialize)
                }),
                grid({ size: { lg: '1of2' } }, doc.data.blurbs.map(function (item) {
                  if (!item.text.length) return null
                  var props = {
                    heading: asText(item.heading),
                    body: asElement(item.text, resolve, reset)
                  }

                  var { link } = item
                  if ((link.id || link.url) && !link.isBroken) {
                    props.link = {
                      href: resolve(link),
                      text: item.link_text,
                      external: link.target === '_blank'
                    }
                  }

                  return html`<div class="u-spaceV2">${blurb(props)}</div>`
                })),
                doc.data.image.url ? framed(Object.assign({
                  format: 'ellipse',
                  alt: doc.data.image.alt || '',
                  srcset: srcset(doc.data.image.url, [200, 400, [800, 'q_50']], { aspect: 278 / 195, transforms: 'c_thumb' }),
                  sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw',
                  src: srcset(doc.data.image.url, [200]).split(' ')[0]
                }, doc.data.image.dimensions)) : null
              )}
              ${doc.data.body.map(asSlice)}
            </div>
          `
        })}
      </div>
    </main>
  `

  // render slice as element
  // (obj, num) -> Element
  function asSlice (slice, index) {
    switch (slice.slice_type) {
      case 'text': {
        let items = slice.items.filter((item) => item.text.length)
        if (!slice.primary.text.length && !items.length) return null
        return html`
          <div class="u-spaceV6">
            ${slice.primary.text.length ? html`
              <div class="Text Text--large">
                ${asElement(slice.primary.text, resolve, serialize)}
              </div>
            ` : null}
            ${items.length ? grid({ size: { md: '1of2' } }, items.map((item) => html`
              <div class="Text Text--large u-spaceB2">
                ${asElement(item.text, resolve, cap)}
              </div>
            `)) : null}
          </div>
        `
      }
      case 'heading': {
        if (!slice.primary.heading.length) return null
        return html`
          <div class="Text Text--large u-spaceT8 u-spaceB6">
            <h2>${asText(slice.primary.heading)}</h2>
            ${slice.primary.text.length ? asElement(slice.primary.text, resolve, serialize) : null}
          </div>
        `
      }
      case 'accordion': {
        return html`
          <section class="u-spaceV6">
            <div class="Text u-sizeFull">
              ${slice.items.map(function (item) {
                if (!item.heading.length) return null
                return html`
                  <details>
                    <summary><h3>${asText(item.heading)}</h3></summary>
                    <div class="Text Text--large">
                      ${asElement(item.text)}
                    </div>
                  </details>
                `
              }).filter(Boolean)}
            </div>
          </section>
        `
      }
      default: return null
    }
  }
}

function meta (state) {
  return state.prismic.getSingle('your_visit', function (err, doc) {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: doc.data.subheading || asText(doc.data.title),
      description: asText(doc.data.description),
      'theme-color': doc.data.theme
    }

    var image = doc.data.featured_image
    if (image && image.url) {
      Object.assign(props, {
        'og:image': image.url,
        'og:image:width': image.dimensions.width,
        'og:image:height': image.dimensions.height
      })
    }

    return props
  })
}
