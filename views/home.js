var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var card = require('../components/card')
var grid = require('../components/grid')
var framed = require('../components/framed')
var embed = require('../components/embed')
var intro = require('../components/intro')
var button = require('../components/button')
var jigsaw = require('../components/jigsaw')
var byline = require('../components/byline')
var reset = require('../components/text/reset')
var Subscribe = require('../components/subscribe')
var serialize = require('../components/text/serialize')
var cap = require('../components/text/cap-heading')
var Blockquote = require('../components/text/blockquote')
var { asText, resolve, srcset } = require('../components/base')
var { i18n } = require('../components/base')

var text = i18n()

module.exports = view(page, meta)

function page (state, emit) {
  // stash of blurbs to aggregate while mapping slices
  var blurbs = []

  return html`
    <main class="View-main">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        if (err) throw err
        if (!doc) {
          return jigsaw(
            intro.loading({ collapse: true }),
            null,
            framed.loading(),
            null,
            { alt: true }
          )
        }
        var body = []
        for (let i = 0, len = doc.data.body.length; i < len; i++) {
          const el = asSlice(doc.data.body[i], i, doc.data.body)
          if (el !== blurbs || i === doc.data.body.length - 1) {
            if (blurbs.length) {
              // render aggregated blurbs as grid
              const opts = { size: { md: '1of2', lg: '1of3' } }
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
            <header>
              ${jigsaw(
                intro({
                  collapse: true,
                  title: asText(doc.data.title),
                  text: asElement(doc.data.description, resolve, serialize)
                }),
                doc.data.cta ? html`
                  <div class="View-action">
                    ${button({ text: text`Read more`, href: resolve(doc.data.cta), primary: true })}
                  </div>
                ` : null,
                doc.data.image.url ? framed(Object.assign({
                  alt: doc.data.image.alt || '',
                  srcset: srcset(doc.data.image.url, [200, 400, [800, 'q_50']], { aspect: 100 / 100, transforms: 'c_thumb' }),
                  sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw',
                  src: srcset(doc.data.image.url, [200]).split(' ')[0]
                }, doc.data.image.dimensions)) : null,
                null,
                { alt: true }
              )}
            </header>
            <div class="u-container">
              <hr class="u-invisible" />
              ${body}
            </div>
          </div>
        `
      })}
    </main>
  `

  // render slice as element
  // (obj, num) -> Element
  function asSlice (slice, index, list) {
    switch (slice.slice_type) {
      case 'text': {
        const items = slice.items.filter((item) => item.text.length)
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
            ${slice.primary.text && slice.primary.text.length ? asElement(slice.primary.text, resolve, serialize) : null}
          </div>
        `
      }
      case 'quote': {
        const blockquote = state.cache(Blockquote, `${state.params.slug}-${index}`)
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
        const sources = srcset(slice.primary.image.url, [400, 600, 900, [1600, 'q_60'], [3000, 'q_50']])
        const attrs = Object.assign({
          sizes: '100vw',
          srcset: sources,
          src: sources.split(' ')[0],
          alt: slice.primary.image.alt || ''
        }, slice.primary.image.dimensions)
        return html`
          <figure class="Text Text--large ${slice.primary.smaller ? '' : 'u-sizeFull'} u-spaceV6">
            <img ${attrs}>
            ${slice.primary.image.copyright ? html`
              <figcaption>
                <small class="Text-muted">${slice.primary.image.copyright}</small>
              </figcaption>
            ` : null}
          </figure>
        `
      }
      case 'video': {
        const items = slice.items.filter((item) => item.video.embed_url)
        return html`
          <div class="u-spaceT7">
            ${slice.primary.video.embed_url ? video(slice.primary.video, {
              large: true
              }) : null}
            ${items.length ? html`
              <div class="u-md-uncontain u-spaceT6">
                ${grid({
                  carousel: true,
                  size: {
                    md: `1of${items.length % 3 ? 2 : 3}`
                  }
                }, items.map((item) => video(item.video)))}
              </div>
            ` : null}
          </div>
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
      case 'newsletter': {
        return html`
          <div>
            ${index !== 0 ? html`<hr class="u-invisible">` : null}
            ${state.cache(Subscribe, `${state.params.slug}-${index}`).render({
              action: state.newsletter,
              title: asText(slice.primary.heading),
              body: slice.primary.text && slice.primary.text.length ? asElement(slice.primary.text, resolve, serialize) : null,
              success: slice.primary.success_message && slice.primary.success_message.length ? asElement(slice.primary.success_message, resolve, serialize) : null,
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
        const { primary } = slice
        if (!primary.file.url || primary.file.isBroken) return null
        blurbs.push(asCard({
          file: true,
          image: primary.image,
          title: primary.title,
          body: primary.text,
          color: primary.color,
          link: {
            href: primary.file.url,
            onclick: () => emit('track:view_item', asText(primary.title), 'Media', 'Download media')
          }
        }))
        return blurbs
      }
      case 'any_blurb': {
        const { primary } = slice
        const { link } = primary
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
              href: resolve(slice.primary.link),
              text: slice.primary.text
            })}
          </div>
        `
      }
      default: return null
    }
  }

  // render oembed object as embeded video
  // obj -> Element
  function video (props, opts = {}) {
    var provider = props.provider_name.toLowerCase()
    var id = embed.id(props)
    if (!id) return null
    return embed(Object.assign({
      url: props.embed_url,
      title: props.title,
      onplay: () => emit('track:view_item', props.embed_url, 'Media', 'Play video'),
      src: `/media/${provider}/w_${opts.large ? 900 : 400}/${id}`,
      width: props.thumbnail_width,
      height: props.thumbnail_height,
      sizes: opts.large ? '100vw' : '(min-width: 600px) 50vw, 100vw',
      srcset: srcset(id, [400, 900, 1800, [2600, 'q_50']], { type: provider })
    }, opts))
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
    const sources = srcset(
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
  return state.prismic.getSingle('homepage', function (err, doc) {
    if (err) throw err
    if (!doc) return null

    var props = {
      'theme-color': doc.data.theme
    }

    return props
  })
}
