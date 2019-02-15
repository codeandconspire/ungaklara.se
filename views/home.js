var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var card = require('../components/card')
var grid = require('../components/grid')
var framed = require('../components/framed')
var intro = require('../components/intro')
var button = require('../components/button')
var jigsaw = require('../components/jigsaw')
var Subscribe = require('../components/subscribe')
var serialize = require('../components/text/serialize')
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
            ${jigsaw(
              intro({
                collapse: true,
                title: asText(doc.data.title),
                text: asElement(doc.data.description, resolve, serialize)
              }),
              doc.data.cta ? html`
                <div class="View-action">
                  ${button({ text: text`Read more`, href: doc.data.cta.url, primary: true })}
                </div>
              ` : null,
              doc.data.image.url ? framed(Object.assign({
                alt: doc.data.image.alt || '',
                srcset: srcset(doc.data.image.url, [200, 400, [800, 'q_50']], { aspect: 100 / 100, transforms: 'c_thumb' }),
                sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw',
                src: srcset(doc.data.image.url, [200]).split(' ')[0]
              }, doc.data.image.dimensions)) : null,
              null,
              true
            )}
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
  return state.prismic.getSingle('homepage', function (err, doc) {
    if (err) throw err
    if (!doc) return null

    var props = {
      'theme-color': doc.data.theme
    }

    return props
  })
}
