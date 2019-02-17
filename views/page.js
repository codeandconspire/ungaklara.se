var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var card = require('../components/card')
var grid = require('../components/grid')
var intro = require('../components/intro')
var byline = require('../components/byline')
var button = require('../components/button')
var reset = require('../components/text/reset')
var Subscribe = require('../components/subscribe')
var cap = require('../components/text/cap-heading')
var serialize = require('../components/text/serialize')
var Blockquote = require('../components/text/blockquote')
var { asText, resolve, srcset } = require('../components/base')

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
            let el = asSlice(doc.data.body[i], i, doc.data.body)
            if (el !== blurbs || i === doc.data.body.length - 1) {
              if (blurbs.length) {
                // render aggregated blurbs as grid
                let opts = { size: { md: '1of2', lg: '1of3' } }
                body.push(html`
                  <div class="u-spaceV5">
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
              ${intro({
                title: asText(doc.data.title),
                text: asElement(doc.data.description),
                badge: doc.data.parent && doc.data.parent.id ? html`
                  <span class="Text">
                    <a class="u-inlineBlock" href="${resolve(doc.data.parent)}">${doc.data.parent.data.shortname ? asText(doc.data.parent.data.shortname) : asText(doc.data.parent.data.title)}</a>:
                  </span>
                ` : null
              })}
              ${body}
            </div>
          `
        })}
      </div>
    </main>
  `

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
      case 'quote': {
        let blockquote = state.cache(Blockquote, `${state.params.slug}-${index}`)
        return html`
          <div class="u-spaceV5">
            ${blockquote.render({
              large: true,
              content: asElement(slice.primary.text, resolve, serialize),
              caption: asElement(slice.primary.cite, resolve, serialize)
            })}
          </div>
        `
      }
      case 'image': {
        if (!slice.primary.image.url) return null
        let sources = srcset(slice.primary.image.url, [400, 600, 900, [1600, 'q_60'], [3000, 'q_50']])
        let attrs = Object.assign({
          sizes: '100vw',
          srcset: sources,
          src: sources.split(' ')[0],
          alt: slice.primary.image.alt || ''
        }, slice.primary.image.dimensions)
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
            ${byline({
              heading: asText(slice.primary.heading),
              body: asElement(slice.primary.text, resolve, reset),
              image: slice.primary.image.url ? Object.assign({
                src: srcset(
                  slice.primary.image.url,
                  [200, 'c_thumb'],
                  { aspect: 278 / 195 }
                ).split(' ')[0],
                sizes: '15rem',
                srcset: srcset(
                  slice.primary.image.url,
                  [200, 400, [800, 'q_50,c_thumb']],
                  { transforms: 'c_thumb', aspect: 278 / 195 }
                ),
                alt: slice.primary.image.alt || ''
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
          file: true,
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
      case 'button': {
        if (!slice.primary.text && !slice.primary.link) return
        return html`
          <div class="u-spaceV5">
            ${button({
              primary: true,
              external: slice.primary.link.link_type === 'Web',
              href: slice.primary.link.url,
              text: slice.primary.text
            })}
          </div>
        `
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
    let sources = srcset(props.image.url, [200, 400, [800, 'q_50']])
    image = Object.assign({
      class: 'u-spaceB2',
      sizes: '13em',
      srcset: sources,
      style: 'max-width: 13em;',
      alt: props.image.alt || '',
      src: sources.split(' ')[0]
    }, props.image.dimensions)
  }

  return html`
    <article class="Text Text--fat">
      ${image ? html`<img ${image} />` : null}
      ${props.label ? html`
        <strong class="Text-label">
          ${props.label}
        </strong>
      ` : null}
      ${props.text.length ? html`
        <div>
          ${asElement(props.text, resolve, serialize)}
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
    let sources = srcset(
      props.image.url,
      [200, 400, 600, 900, [1600, 'q_60,c_thumb']],
      { transforms: 'c_thumb' }
    )
    props.image = Object.assign({
      srcset: sources,
      sizes: '(min-width: 600px) 50vw, 100vw',
      alt: props.image.alt || '',
      src: srcset(props.image.url, [900, 'c_thumb']).split(' ')[0]
    }, props.image.dimensions)
  }

  return card(props)
}

function meta (state) {
  return state.prismic.getByUID('page', state.params.slug, (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: doc.data.shortname && doc.data.shortname.length ? asText(doc.data.shortname) : asText(doc.data.title),
      description: doc.data.shortname ? `${asText(doc.data.title)}. ${asText(doc.data.description)}` : asText(doc.data.description),
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
