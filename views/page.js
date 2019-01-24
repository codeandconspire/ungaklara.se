var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var card = require('../components/card')
var grid = require('../components/grid')
var intro = require('../components/intro')
var { asText, resolve } = require('../components/base')
var Blockquote = require('../components/text/blockquote')
var { serialize } = require('../components/text/serialize')

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getByUID('page', state.params.slug, (err, doc) => {
          if (err) throw err
          if (!doc) return intro.loading()
          return html`
            <div>
              <div class="u-spaceB8">
                ${intro({ title: asText(doc.data.title), text: asElement(doc.data.description) })}
              </div>
              ${doc.data.body.map(function slices (slice, index) {
                switch (slice.slice_type) {
                  case 'text': {
                    if (!slice.primary.text.length) return null
                    return html`
                      <div class="Text Text--large u-spaceV6">
                        ${asElement(slice.primary.text, resolve, serialize)}
                      </div>
                    `
                  }
                  case 'quote': {
                    let blockquote = state.cache(Blockquote, `${doc.id}-${index}`)
                    return html`
                      <div class="u-spaceV3">
                        ${blockquote.render({
                          large: true,
                          content: asElement(slice.primary.text, resolve, serialize),
                          caption: asElement(slice.primary.cite, resolve, serialize)
                        })}
                      </div>
                    `
                  }
                  case 'image': {
                    let attrs = {
                      alt: slice.primary.image.alt || '',
                      src: slice.primary.image.url,
                      width: slice.primary.image.dimensions.width,
                      height: slice.primary.image.dimensions.height
                    }
                    return html`
                      <figure class="Text Text--large u-sizeFull u-spaceV6">
                        <img ${attrs}>
                        ${slice.primary.image.copyright ? html`
                          <figcaption>
                            <small class="Text-muted">${slice.primary.image.copyright}</small>
                          </figcaption>
                        ` : null}
                      </figure>
                    `
                  }
                  case 'author': {
                    let rows = [
                      [slice.primary.name, slice.primary.title].filter(Boolean).join(', ')
                    ]

                    if (slice.primary.email) {
                      rows.push(html`
                        <a href="mailto:${slice.primary.email}">${slice.primary.email}</a>
                      `)
                    }

                    if (slice.primary.phone) {
                      rows.push(html`
                        <a href="tel:${slice.primary.phone.replace(/[^+\d]/g, '')}">${slice.primary.phone}</a>
                      `)
                    }

                    return html`
                      <div class="Text u-spaceV6">
                        <hr>
                        ${slice.primary.heading.length ? html`
                          <h2 class="Text-h3 u-spaceV2">${asText(slice.primary.heading)}</h2>
                        ` : null}
                        <p class="u-spaceT2">
                          ${rows.filter(Boolean).reduce(function (all, row) {
                            all.push(row, html`<br>`)
                            return all
                          }, [])}
                        </p>
                      </div>
                    `
                  }
                  case 'accordion': {
                    let hasHeading = Boolean(slice.primary.heading.length)
                    return html`
                      <section class="u-spaceV8">
                        ${hasHeading || slice.primary.introduction.length ? html`
                          <div class="Text Text--large u-spaceB6">
                            ${hasHeading ? html`
                              <h2>${asText(slice.primary.heading)}</h2>
                            ` : null}
                            ${slice.primary.introduction.length ? asElement(slice.primary.introduction, resolve, serialize) : null}
                          </div>
                        ` : null}
                        <div class="Text u-sizeFull">
                          ${slice.items.map(function (item) {
                            if (!item.heading.length) return null
                            var summary = asText(item.heading)
                            return html`
                              <details>
                                <summary>${hasHeading ? html`<h3>${summary}</h3>` : html`<h2>${summary}</h2>`}</summary>
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
                  case 'link_list': {
                    let items = slice.items.filter((item) => item.page.id && !item.page.isBroken)
                    if (!items.length) return null
                    let opts = { size: { md: '1of2' } }
                    if (items.length === 3 || items.length > 4) {
                      opts.size.lg = '1of3'
                    }
                    let heading = asText(slice.primary.heading)
                    return html`
                      <div class="u-spaceV8">
                        ${heading || slice.primary.introduction.length ? html`
                          <div class="Text Text--large u-spaceB6">
                            ${heading ? html`<h2>${heading}</h2>` : null}
                            ${slice.primary.introduction.length ? asElement(slice.primary.introduction, resolve, serialize) : null}
                          </div>
                        ` : null}
                        ${grid(opts, items.map((item) => asCard(item.page, item.color)))}
                      </div>
                    `
                  }
                  default: return null
                }
              })}
            </div>
          `
        })}
      </div>
    </main>
  `
}

// render linked document as card
// obj -> Element
function asCard (doc, color) {
  var props = {
    title: asText(doc.data.title),
    body: asText(doc.data.description),
    color: color || doc.data.theme,
    link: {
      href: resolve(doc),
      text: doc.data.cta
    }
  }

  var image = doc.data.featured_image
  if (image && image.url) {
    props.image = {
      alt: image.alt || '',
      src: image.url,
      width: image.dimensions.width,
      height: image.dimensions.height
    }
  }

  return card(props)
}

function meta (state) {
  return state.prismic.getByUID('page', state.params.slug, (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
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
