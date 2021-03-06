var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var card = require('../components/card')
var grid = require('../components/grid')
var blurb = require('../components/blurb')
var embed = require('../components/embed')
var intro = require('../components/intro')
var byline = require('../components/byline')
var reset = require('../components/text/reset')
var Subscribe = require('../components/subscribe')
var serialize = require('../components/text/serialize')
var checklist = require('../components/text/checklist')
var { asText, resolve, i18n, luma, srcset } = require('../components/base')

var text = i18n()

module.exports = view(teachers, meta)

function teachers (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getSingle('teachers', function (err, doc) {
          if (err) throw err
          if (!doc) {
            return html`
              <header>
                <div class="u-spaceB8">${intro.loading()}</div>
                ${grid({ size: { md: '1of3' } }, [blurb.loading(), blurb.loading(), blurb.loading()])}
              </header>
            `
          }

          // group section slices separated by certain types
          var sections = doc.data.sections.reduce(function (list, slice) {
            if (slice.slice_type === 'introduction') list.push([slice])
            else if (slice.slice_type === 'links') list.push([slice])
            else list[list.length - 1].push(slice)
            return list
          }, [[]]).filter((section) => section.length)

          return html`
            <div>
              <header>
                <div class="u-spaceB8">
                  ${intro({ title: asText(doc.data.title), badge: asText(doc.data.shortname), text: asElement(doc.data.description) })}
                </div>
                ${grid({ size: { md: '1of3' } }, doc.data.blurbs.map(function (item) {
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

                  return blurb(props)
                }))}
              </header>
              <hr />
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
                      ${slice.primary.link_text || slice.primary.link.data.cta || text('Read more')}
                    </a>
                  </strong>
                ` : null}
              </div>
            </div>
          `

          if (slice.primary.pointers.length) {
            const attrs = {}
            if (color) {
              attrs.style = `background-color: ${color};`
              if (luma(color) < 110) attrs.class = 'u-colorWhite'
            } else {
              attrs.class = 'u-bgTheme'
            }

            content = grid([
              grid.cell({ size: { lg: '2of3' } }, content),
              grid.cell({ size: { lg: '1of3' } }, html`
                <div ${attrs}>
                  <div class="Text u-paddedBox">
                    ${slice.primary.pointers_heading ? html`
                      <h2 class="Text-h5 u-textUppercase u-spaceB1">
                        <small>${slice.primary.pointers_heading}</small>
                      </h2>
                    ` : null}
                    ${asElement(slice.primary.pointers, resolve, checklist)}
                  </div>
                </div>
              `)
            ])
          }

          return content
        }
        case 'text': {
          const items = slice.items.filter((item) => item.text.length)
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
          })
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
        case 'newsletter': {
          return html`
            <div>
              ${index !== 0 ? html`<hr class="u-invisible">` : null}
              ${state.cache(Subscribe, `${state.params.slug}-${index}`).render({
                action: state.newsletter,
                title: asText(slice.primary.heading),
                body: slice.primary.text && slice.primary.text.length ? asElement(slice.primary.text, resolve, serialize) : null,
                success: slice.primary.success_message && slice.primary.success_message.length ? asElement(slice.primary.success_message, resolve, serialize) : null
              })}
              ${index < list.length - 1 ? html`<hr />` : null}
            </div>
          `
        }
        case 'links': {
          const items = slice.items.filter((item) => item.link.id && !item.link.isBroken)
          if (!items.length) return null
          const opts = { size: { md: '1of2', lg: '1of3' } }
          const heading = asText(slice.primary.heading)
          return html`
            <div class="u-pushDown">
              ${heading ? html`
                <div class="Text Text--large u-spaceB5">
                  ${heading ? html`<h2>${heading}</h2>` : null}
                </div>
              ` : null}
              ${grid(opts, items.map(function (item) {
                if (item.link.type === 'page') {
                  return state.prismic.getByUID('page', item.link.uid, function (err, doc) {
                    if (err) return null
                    if (!doc) return card.loading()
                    return asCard(doc, item.color)
                  })
                }
                return asCard(item.link, item.color)
              }))}
            </div>
          `
        }
        default: return null
      }
    })

    if (index !== list.length - 1) blocks.push(html`<hr>`)

    return html`
      <div>
        ${blocks}
      </div>
    `
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
// (obj, str?) -> Element
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
    const sources = srcset(
      image.url,
      [200, 400, 800, [1600, 'q_70,c_thumb']],
      { transforms: 'c_thumb' }
    )
    props.image = Object.assign({
      alt: image.alt || '',
      srcset: sources,
      sizes: '(min-width: 600px) 50vw, 100vw',
      src: srcset(image.url, [900, 'c_thumb']).split(' ')[0]
    }, image.dimensions)
  }

  return card(props)
}

function meta (state) {
  return state.prismic.getSingle('teachers', (err, doc) => {
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
