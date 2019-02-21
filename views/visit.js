var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var grid = require('../components/grid')
var blurb = require('../components/blurb')
var intro = require('../components/intro')
var framed = require('../components/framed')
var jigsaw = require('../components/jigsaw')
var reset = require('../components/text/reset')
var Masonry = require('../components/masonry')
var figure = require('../components/text/figure')
var Subscribe = require('../components/subscribe')
var cap = require('../components/text/cap-heading')
var serialize = require('../components/text/serialize')
var { asText, resolve, srcset } = require('../components/base')

module.exports = view(visit, meta)

function visit (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('your_visit', function (err, doc) {
        if (err) throw err
        if (!doc) {
          return jigsaw(
            intro.loading({ badge: true }),
            grid({ size: { lg: '1of2' } }, [blurb.loading(), blurb.loading()]),
            framed.loading({ format: 'ellipse' })
          )
        }

        return html`
          <div>
            ${jigsaw(
              intro({
                collapse: true,
                title: asText(doc.data.title),
                badge: asText(doc.data.shortname)
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

                return html`<div class="u-spaceB1">${blurb(props)}</div>`
              })),
              doc.data.image.url ? framed(Object.assign({
                format: 'ellipse',
                alt: doc.data.image.alt || '',
                srcset: srcset(doc.data.image.url, [200, 400, [800, 'q_50']], { aspect: 278 / 195, transforms: 'c_thumb' }),
                sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw',
                src: srcset(doc.data.image.url, [200]).split(' ')[0]
              }, doc.data.image.dimensions)) : null
            )}
            <div class="u-container">
              ${doc.data.gallery ? html`
                <div class="u-spaceV2">
                  ${state.cache(Masonry, doc.id + '-visit-media').render(doc.data.gallery.map(galleryItem).filter(Boolean))}
                </div>
              ` : null}
              ${doc.data.body.map(asSlice)}
            </div>
          </div>
        `
      })}
    </main>
  `

  // render media element from slice
  // (obj, num) -> Element
  function galleryItem (item) {
    if (!item.gallery_item.url) return null
    return figure({
      image: item.gallery_item,
      sources: [400, 599, 900, [1500, 'q_40']],
      sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw'
    })
  }

  // render slice as element
  // (obj, num) -> Element
  function asSlice (slice, index, list) {
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
                ${asElement(item.text, resolve, cap('h4'))}
              </div>
            `)) : null}
          </div>
        `
      }
      case 'heading': {
        if (!slice.primary.heading.length) return null
        return html`
          <div class="Text Text--large u-spaceB5 u-pushDown">
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
      case 'newsletter': {
        return html`
          <div>
            ${index !== 0 ? html`<hr class="u-invisible">` : null}
            ${state.cache(Subscribe, `${state.params.slug}-${index}`).render({
              action: state.mailchimp,
              title: asText(slice.primary.heading),
              body: slice.primary.text.length ? asElement(slice.primary.text, resolve, serialize) : null,
              success: slice.primary.success_message.length ? asElement(slice.primary.success_message, resolve, serialize) : null,
              ref: slice.primary.ref
            })}
            ${index < list.length - 1 ? html`<hr />` : null}
          </div>
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
      title: doc.data.shortname && doc.data.shortname.length ? asText(doc.data.shortname) : asText(doc.data.title),
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
