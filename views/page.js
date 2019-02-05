var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var card = require('../components/card')
var grid = require('../components/grid')
var intro = require('../components/intro')
var byline = require('../components/byline')
var reset = require('../components/text/reset')
var serialize = require('../components/text/serialize')
var { asText, resolve } = require('../components/base')
var Blockquote = require('../components/text/blockquote')

module.exports = view(page, meta)

function page (state, emit) {
  // stash of blurbs to aggregate while mapping slices
  var blurbs = []

  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getByUID('page', state.params.slug, (err, doc) => {
          if (err) throw err
          if (!doc) return intro.loading()

          var body = []
          for (let i = 0, len = doc.data.body.length; i < len; i++) {
            let el = asSlice(doc.data.body[i], i)
            if (el !== blurbs || i === doc.data.body.length - 1) {
              if (blurbs.length) {
                // render aggregated blurbs as grid
                let opts = { size: { md: '1of2' } }
                if (blurbs.length === 3 || blurbs.length > 4) {
                  opts.size.lg = '1of3'
                }
                body.push(html`
                  <div class="u-spaceV8">
                    ${grid(opts, blurbs)}
                  </div>
                `)
              }
              if (el !== blurbs) body.push(el)
              blurbs = []
            }
          }

          return html`
            <div>
              <div class="u-spaceB8">
                ${intro({ title: asText(doc.data.title), text: asElement(doc.data.description) })}
              </div>
              ${body}
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
        if (!slice.primary.text.length) return null
        return html`
          <div class="Text Text--large u-spaceV6">
            ${asElement(slice.primary.text, resolve, serialize)}
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
      case 'quote': {
        let blockquote = state.cache(Blockquote, `${state.params.slug}-${index}`)
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
        return html`
          <div class="u-spaceV6">
            <div class="Text"><hr class="u-spaceB1"></div>
            ${byline({
              heading: asText(slice.primary.heading),
              body: asElement(slice.primary.text, resolve, reset),
              image: slice.primary.image.url ? Object.assign({
                src: slice.primary.image.url,
                alt: slice.primary.image.alt
              }, slice.primary.image.dimensions) : null
            })}
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
      case 'link_blurb': {
        let { primary } = slice
        if (!primary.link.id || primary.link.isBroken) return null
        blurbs.push(asCard({
          title: primary.link.data.title,
          body: primary.link.data.description,
          image: primary.link.data.featured_image,
          color: primary.color || primary.link.data.theme,
          link: {
            href: resolve(primary.link),
            text: primary.link.data.cta
          }
        }))
        return blurbs
      }
      case 'file_blurb': {
        let { primary } = slice
        if (!primary.file.url || primary.file.isBroken) return null
        blurbs.push(asCard({
          image: primary.image,
          title: primary.title,
          body: primary.text,
          color: primary.color,
          link: {
            href: primary.file.url
          }
        }))
        return blurbs
      }
      case 'any_blurb': {
        let { primary } = slice
        let { link } = primary
        if ((!link.url && !link.id) || link.isBroken) return null
        blurbs.push(asCard({
          image: primary.image,
          title: primary.title,
          body: primary.text,
          color: primary.color,
          link: {
            href: resolve(link),
            external: link.target === '_blank'
          }
        }))
        return blurbs
      }
      default: return null
    }
  }
}

// render linked document as card
// obj -> Element
function asCard (props) {
  props = Object.assign({}, props, {
    title: asText(props.title),
    body: asText(props.body)
  })

  if (props.image && props.image.url) {
    props.image = {
      alt: props.image.alt || '',
      src: props.image.url,
      width: props.image.dimensions.width,
      height: props.image.dimensions.height
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
