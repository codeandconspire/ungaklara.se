var html = require('choo/html')
var asElement = require('prismic-element')
var events = require('./events')
var view = require('../components/view')
var grid = require('../components/grid')
var event = require('../components/event')
var intro = require('../components/intro')
var spotify = require('../components/spotify')
var Masonry = require('../components/masonry')
var factsBox = require('../components/facts-box')
var details = require('../components/text/details')
var Blockquote = require('../components/text/blockquote')
var { serialize } = require('../components/text/serialize')
var { asText, resolve, i18n, hexToRgb, vw } = require('../components/base')

var text = i18n()
var page = view(eventPage, meta)

module.exports = catchall

// capture the different listing pages and defer to events page
// (obj, fn) -> Element
function catchall (state, emit) {
  if (state.params.slug === 'kalendarium' || state.params.slug === 'arkiv') {
    return events(state, emit)
  }
  return page(state, emit)
}

function eventPage (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getByUID('event', state.params.slug, function (err, doc) {
          if (err) throw err
          if (!doc) return intro.loading({ badge: true, image: true })

          var blocks = []
          var collapse = typeof window !== 'undefined' && vw() < 600

          // facts box
          if (doc.data.about.length) {
            blocks.push(html`
              <div class="u-spaceV6">
                ${event({
                  image: doc.data.poster.url ? doc.data.poster : null,
                  body: doc.data.about,
                  actions: [
                    { text: text`Show dates`, href: '/' },
                    { text: text`Buy ticket`, href: '/', primary: true }
                  ]
                })}
              </div>
            `)
          }

          // about the production
          if (doc.data.details.length) {
            blocks.push(html`
              <div class="u-spaceV6">
                ${factsBox(doc.data.details)}
              </div>
            `)
          }

          if (collapse) {
            // spotify media
            let spotify = doc.data.media
              .filter((slice) => slice.slice_type === 'spotify')
              .map(mediaSlice)
              .filter(Boolean)
            if (spotify.length) {
              blocks.push(spotify.length > 1 ? html`
                <div class="u-uncontain">
                  ${grid({ carousel: true }, spotify)}
                </div>
              ` : spotify[0])
            }

            // some sections are arranged into an accordion
            let accordion = []

            // images (accordion)
            let images = doc.data.media
              .filter((slice) => slice.slice_type === 'image')
              .map(mediaSlice)
              .filter(Boolean)
            if (images.length) {
              accordion.push(details(html`<h2>${text`Images`}</h2>`, html`
                <div class="u-uncontain">
                  ${grid({ carousel: true }, images.map((image) => grid.cell(image)))}
                </div>
              `))
            }

            // quotes (accordion)
            let quotes = doc.data.media
              .filter((slice) => slice.slice_type === 'quote')
              .map(mediaSlice)
              .filter(Boolean)
            if (quotes.length) {
              accordion.push(details(html`<h2>${text`Quotes`}</h2>`, quotes))
            }

            // team (accordion)
            doc.data.team.forEach(function (slice) {
              if (!slice.items.length) return
              if (slice.slice_type !== 'group') return
              if (!slice.primary.heading.length) return

              var opts = { size: { lg: '1of4' } }
              var heading = asText(slice.primary.heading)
              var hasImage = slice.items.find((item) => item.image.url)
              if (hasImage) opts.size.xs = '1of2'
              else opts.size.md = '1of2'

              accordion.push(details(
                html`<h2>${heading}</h2>`,
                grid(opts, slice.items.map(teamMember))
              ))
            })

            if (accordion.length) {
              // add accordion to blocks
              blocks.push(html`<div class="Text u-sizeFull u-spaceV6">${accordion}</div>`)
            }
          } else {
            // on large screens media is displayed in a masonry grid
            let media = doc.data.media.map(mediaSlice).filter(Boolean)
            if (media.length) {
              blocks.push(state.cache(Masonry, doc.id + '-media').render(media))
            }

            // teams are just listed one after another
            doc.data.team.forEach(function (slice) {
              if (!slice.items.length) return
              if (slice.slice_type !== 'group') return
              if (!slice.primary.heading.length) return

              var opts = { size: { lg: '1of4' } }
              var heading = asText(slice.primary.heading)
              var hasImage = slice.items.find((item) => item.image.url)
              if (hasImage) opts.size.xs = '1of2'
              else opts.size.md = '1of2'

              blocks.push(html`
                <div class="u-spaceV8">
                  <div class="Text u-spaceB6">
                    <h2>${heading}</h2>
                  </div>
                  ${grid(opts, slice.items.map(teamMember))}
                </div>
              `)
            })
          }

          var attrs = {}
          if (doc.data.theme) {
            attrs.style = `--theme-color: ${hexToRgb(doc.data.theme).join(', ')}`
          }

          return html`
            <div ${attrs}>
              <div class="u-spaceB6">
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
              ${blocks}
            </div>
          `
        })}
      </div>
    </main>
  `

  // render media element from slice
  // (obj, num) -> Element
  function mediaSlice (slice, index) {
    switch (slice.slice_type) {
      case 'image': {
        if (!slice.primary.image.url) return null
        let attrs = {
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
        if (!slice.primary.text.length) return null
        let blockquote = state.cache(Blockquote, `event-media-${index}`)
        return html`
          <div class="u-spaceV3">
            ${blockquote.render({
              content: asElement(slice.primary.text, resolve, serialize),
              caption: asElement(slice.primary.cite, resolve, serialize)
            })}
          </div>
        `
      }
      case 'spotify': {
        if (!slice.primary.uri.embed_url) return null
        let body = slice.primary.text.length ? asElement(slice.primary.text, resolve, serialize) : null
        return spotify(slice.primary.uri.embed_url, body)
      }
      default: return null
    }
  }
}

// render team member
// obj -> Element
function teamMember (props) {
  var image
  if (props.image.url) {
    image = {
      class: 'u-spaceB1',
      style: 'width: 13em;',
      alt: props.image.alt || '',
      src: props.image.url,
      width: props.image.dimensions.width,
      height: props.image.dimensions.height
    }
  }

  return html`
    <article class="Text">
      ${image ? html`<img ${image} />` : null}
      ${props.label ? html`
        <strong class="u-block u-textUppercase u-textHeading">
          ${props.label}
        </strong>
      ` : null}
      ${props.text.length ? html`
        <div class="u-spaceT1 u-textBold">
          ${asElement(props.text, resolve, serialize)}
        </div>
      ` : null}
    </article>
  `
}

function meta (state) {
  return state.prismic.getByUID('event', state.params.slug, (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.featured_image.url ? doc.data.featured_image : doc.data.image
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
