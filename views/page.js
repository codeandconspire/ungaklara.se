var html = require('choo/html')
var asElement = require('prismic-element')
var { Elements } = require('prismic-richtext')
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
                ${intro({
                  title: asText(doc.data.title),
                  text: asElement(doc.data.description),
                  badge: doc.data.parent ? html`
                    <span>
                      <a href="${resolve(doc.data.parent)}">${asText(doc.data.parent.data.title)}</a> – ${asText(doc.data.title)}
                    </span>
                  ` : null
                })}
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
                ${asElement(item.text, resolve, serializeColumn)}
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
      case 'team': {
        if (!slice.items.length) return
        let opts = { size: { lg: '1of4' } }
        let hasImage = slice.items.find((item) => item.image.url)
        if (hasImage) opts.size.xs = '1of2'
        else opts.size.md = '1of2'
        return grid(opts, slice.items.map(teamMember))
      }
      case 'link_blurb': {
        let link = slice.primary.link
        if (!link.id || link.isBroken) return null
        if (link.type === 'page') {
          link = state.prismic.getByUID('page', link.uid, function (err, doc) {
            if (err) return null
            return doc
          })
        }
        if (!link) {
          blurbs.push(card.loading())
        } else {
          blurbs.push(asCard({
            title: link.data.title,
            body: link.data.description,
            image: link.data.featured_image,
            color: slice.primary.color || link.data.theme,
            link: {
              href: resolve(link),
              text: link.data.cta
            }
          }))
        }
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

// render team member
// obj -> Element
function teamMember (props) {
  var image
  if (props.image.url) {
    image = {
      class: 'u-spaceB2',
      alt: props.image.alt || '',
      src: props.image.url,
      width: props.image.dimensions.width,
      height: props.image.dimensions.height
    }
  }

  return html`
    <article class="Text u-sizeFull">
      ${image ? html`<img ${image} />` : null}
      ${props.label ? html`
        <strong class="u-block u-textHeading">
          ${props.label}
        </strong>
      ` : null}
      ${props.text.length ? html`
        <div class="u-spaceT2">
          ${asElement(props.text, resolve, reset)}
        </div>
      ` : null}
    </article>
  `
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

function serializeColumn (type, node, content, children) {
  switch (type) {
    case Elements.heading1: return html`<h1 class="Text-h4">${children}</h1>`
    case Elements.heading2: return html`<h2 class="Text-h4">${children}</h2>`
    case Elements.heading3: return html`<h3 class="Text-h4">${children}</h3>`
    case Elements.heading4: return html`<h4 class="Text-h4">${children}</h4>`
    case Elements.heading5: return html`<h5 class="Text-h4">${children}</h5>`
    case Elements.heading6: return html`<h6 class="Text-h4">${children}</h6>`
    default: return serialize(type, node, content, children)
  }
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
