var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var card = require('../components/card')
var grid = require('../components/grid')
var intro = require('../components/intro')
var byline = require('../components/byline')
var reset = require('../components/text/reset')
var serialize = require('../components/text/serialize')
var { asText, resolve, i18n, luma } = require('../components/base')

var text = i18n()

module.exports = view(teachers, meta)

function teachers (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getSingle('teachers', function (err, doc) {
          if (err) throw err
          if (!doc) return intro.loading()

          // group section slices separated by certain types
          var sections = doc.data.sections.reduce(function (list, slice) {
            if (slice.slice_type === 'introduction') list.push([slice])
            else if (slice.slice_type === 'links') list.push([slice])
            else list[list.length - 1].push(slice)
            return list
          }, [[]]).filter((section) => section.length)

          return html`
            <div>
              <div class="u-spaceB8">
                ${intro({ title: asText(doc.data.title), text: asElement(doc.data.description) })}
              </div>
              ${grid({ size: { md: '1of3' } }, doc.data.blurbs.map(function (item) {
                if (!item.link.url && !item.link.id) return null
                var attrs = { href: resolve(item.link) }
                if (item.link.target) {
                  attrs.target = item.link.target
                  if (item.link.target === '_blank') {
                    attrs.rel = 'noopener noreferrer'
                  }
                }
                return html`
                  <div class="Text">
                    <h2 class="Text-h5 u-textUppercase u-spaceB1">
                      <small>${asText(item.heading)}</small>
                    </h2>
                    <div class="Text-large u-spaceB3 u-textBold">
                      ${item.text.length ? asElement(item.text, resolve, reset) : null}
                    </div>
                    <strong>
                      <a ${attrs}>${item.link_text || text`Read more`}</a>
                    </strong>
                  </div>
                `
              }).filter(Boolean))}
              <hr class="u-spaceV8">
              ${sections.map(section)}
            </div>
          `
        })}
      </div>
    </main>
  `

  function section (slices, index, list) {
    var color
    var blocks = slices.map(function (slice) {
      switch (slice.slice_type) {
        case 'introduction': {
          color = slice.primary.color
          var content = html`
            <div class="u-spaceB4">
              <div class="Text Text--large">
                <h2>${asText(slice.primary.heading)}</h2>
                ${asElement(slice.primary.text, resolve, serialize)}
                ${slice.primary.link.id && !slice.primary.link.isBroken ? html`
                  <strong class="u-spaceT3">
                    <a href="${resolve(slice.primary.link)}">
                      ${slice.primary.link.data.cta || text(`Read more`)}
                    </a>
                  </strong>
                ` : null}
              </div>
            </div>
          `

          if (slice.primary.pointers.length) {
            let attrs = {}
            if (color) {
              attrs.style = `background-color: ${color};`
              if (luma(color) < 185) attrs.class = 'u-colorWhite'
            } else {
              attrs.class = 'u-bgTheme'
            }

            content = grid([
              grid.cell({ size: { lg: '2of3' } }, content),
              grid.cell({ size: { lg: '1of3' } }, html`
                <div ${attrs}>
                  <div class="Text u-spaceA4">
                    <h2 class="Text-h5 u-textUppercase u-spaceB1">
                      <small>${text`Good to know`}</small>
                    </h2>
                    ${asElement(slice.primary.pointers, resolve, serialize)}
                  </div>
                </div>
              `)
            ])
          }

          return content
        }
        case 'text': {
          let items = slice.items.filter((item) => item.text.length)
          if (!items.length) return null

          let cols
          if (items.length >= 6) cols = 3
          if (items.length <= 4) cols = items.length
          if (items.length === 5) cols = index < 4 ? 3 : 2

          return html`
            <div class="u-spaceV6">
              ${grid({ size: { md: `1of${cols}` } }, items.map((item) => html`
                <div class="Text">
                  ${asElement(item.text, resolve, serialize)}
                </div>
              `))}
            </div>
          `
        }
        case 'contact': {
          return byline({
            color: color,
            heading: asText(slice.primary.heading),
            body: asElement(slice.primary.text, resolve, reset),
            image: slice.primary.image.url ? Object.assign({
              src: slice.primary.image.url,
              alt: slice.primary.image.alt
            }, slice.primary.image.dimensions) : null
          })
        }
        case 'links': {
          let items = slice.items.filter((item) => item.link.id && !item.link.isBroken)
          if (!items.length) return null
          let opts = { size: { md: '1of2' } }
          if (items.length === 3 || items.length > 4) {
            opts.size.lg = '1of3'
          }
          let heading = asText(slice.primary.heading)
          return html`
            <div class="u-spaceV8">
              ${heading ? html`
                <div class="Text Text--large u-spaceB6">
                  ${heading ? html`<h2>${heading}</h2>` : null}
                </div>
              ` : null}
              ${grid(opts, items.map((item) => asCard(item.link, item.color)))}
            </div>
          `
        }
        default: return null
      }
    })

    if (index !== list.length - 1) blocks.push(html`<hr class="u-spaceV8">`)

    return html`
      <div class="u-spaceV8">
        ${blocks}
      </div>
    `
  }
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
  return state.prismic.getSingle('teachers', (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
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
