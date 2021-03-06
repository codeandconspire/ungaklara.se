var html = require('choo/html')
var parse = require('date-fns/parse')
var asElement = require('prismic-element')
var startOfDay = require('date-fns/start_of_day')
var events = require('./events')
var view = require('../components/view')
var grid = require('../components/grid')
var event = require('../components/event')
var embed = require('../components/embed')
var intro = require('../components/intro')
var button = require('../components/button')
var ticket = require('../components/ticket')
var symbol = require('../components/symbol')
var Hashtag = require('../components/hashtag')
var spotify = require('../components/spotify')
var trailer = require('../components/trailer')
var Masonry = require('../components/masonry')
var Toolbar = require('../components/toolbar')
var factsBox = require('../components/facts-box')
var figure = require('../components/text/figure')
var details = require('../components/text/details')
var pagination = require('../components/pagination')
var serialize = require('../components/text/serialize')
var Blockquote = require('../components/text/blockquote')
var { asText, resolve, i18n, vw, filetype, srcset } = require('../components/base')

var TIME_REG = /(\d{2})(?:.|:)(\d{2})/

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
      ${state.prismic.getByUID('event', state.params.slug, function (err, doc) {
        if (err) throw err
        if (!doc) {
          return html`
            <div class="u-container">
              ${intro.loading({ badge: true, image: true })}
            </div>
          `
        }

        var blocks = []
        var title = asText(doc.data.title)
        var collapse = typeof window !== 'undefined' && vw() < 600
        var videos = doc.data.videos.filter((group) => group.video.embed_url)

        var hashtag = null
        if (doc.data.hashtag) {
          const link = doc.data.hashtag_link
          const component = state.cache(Hashtag, doc.id + '-hashtag')
          if (!link || link.isBroken || (!link.id && !link.url)) {
            hashtag = component.render(doc.data.hashtag)
          } else {
            const href = resolve(link)
            hashtag = component.render(doc.data.hashtag, href, link)
          }
        }

        // about the production
        if (doc.data.about.length) {
          const actions = []
          if (doc.data.dates.find((item) => item.date)) {
            actions.push(() => ({
              text: html`
                <span>
                  <span class="u-sm-show">${text`Show showdates`}</span>
                  <span class="u-sm-hide">${text`Showdates`}</span>
                </span>
              `,
              icon: symbol.calendar(),
              href: `#${doc.id}-dates`,
              onclick: () => emit('track:view_item_list', title, 'Tickets', 'Show tickets')
            }))
          }
          if (doc.data.buy_link.url) {
            actions.push(() => ({
              target: '_blank',
              rel: 'noopener noreferrer',
              text: text`Buy ticket`,
              icon: symbol.arrow(),
              href: doc.data.buy_link.url,
              primary: true,
              onclick: () => emit('track:purchase', title)
            }))
          }

          blocks.push(html`
            <div class="u-container">
              ${event({
                sticky: true,
                image: doc.data.poster.url ? doc.data.poster : null,
                body: doc.data.about,
                actions: actions.map((action) => action())
              })}
            </div>
          `)

          if (actions.length) {
            blocks.push(state.cache(Toolbar, doc.id + '-toolbar').render({
              heading: asText(doc.data.shortname) || title,
              actions: actions.map((action) => button(Object.assign({
                class: 'u-block'
              }, action())))
            }))
          }
        }

        // facts box
        if (doc.data.details.length) {
          blocks.push(html`
            <div class="u-md-container u-spaceT7">
              ${factsBox(doc.data.details)}
            </div>
          `)
        }

        if (collapse) {
          // videos media
          if (videos.length) {
            blocks.push(html`
              <div class="u-container u-spaceT7 u-posRelative">
                ${hashtag}
                ${videos.length > 1 ? html`
                  <div class="u-uncontain">
                    ${grid({ carousel: true }, videos.map((group) => video(group.video)))}
                  </div>
                ` : video(videos[0].video)}
              </div>
            `)
          }

          // spotify media
          const spotify = doc.data.media
            .filter((slice) => slice.slice_type === 'spotify')
            .map(mediaSlice)
            .filter(Boolean)
          if (spotify.length) {
            blocks.push(spotify.length > 1 ? html`
              <div class="u-uncontain u-spaceV5">
                ${grid({ carousel: true }, spotify)}
              </div>
            ` : html`<div class="u-container u-spaceV6">${spotify[0]}</div>`)
          }

          // some sections are arranged into an accordion
          const accordion = []

          // images (accordion)
          const images = doc.data.media
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
          const quotes = doc.data.media
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

            var opts = { size: { md: '1of3', lg: '1of4' } }
            var heading = asText(slice.primary.heading)
            var hasImage = slice.items.find((item) => item.image.url)
            if (hasImage) opts.size.xs = '1of2'
            else opts.size.md = '1of3'

            accordion.push(details(
              html`<h2>${heading}</h2>`,
              grid(opts, slice.items.map(teamMember))
            ))
          })

          if (accordion.length) {
            // add accordion to blocks
            blocks.push(html`
              <div class="u-container">
                <div class="Text u-sizeFull u-spaceV5">
                  ${accordion}
                </div>
              </div>
            `)
          }
        } else {
          // on large screens media is displayed in a masonry grid
          const media = doc.data.media.map(mediaSlice).filter(Boolean)
          if (media.length) {
            blocks.push(html`
              <div class="u-container">
                ${state.cache(Masonry, doc.id + '-media').render(media)}
              </div>
            `)
          }

          // videos, featuring the first one as featured with background
          if (videos.length) {
            let first = videos[0].video
            const rest = videos.slice(1).map(function (group, index, list) {
              var cols = 2
              if (list.length === 3 || list.length >= 6) cols = 3
              if (list.length === 5) cols = index < 4 ? 3 : 2
              var opts = { size: { md: `1of${cols}` } }
              return grid.cell(opts, video(group.video, { size: 'sm' }))
            }).filter(Boolean)

            const id = embed.id(first)
            if (id) {
              const bgProps = {}
              const background = doc.data.featured_background
              if (background.url) {
                Object.assign(bgProps, {
                  src: srcset(background.url, [900]).split(' ')[0],
                  sizes: '(min-width: 2000px) 100vw, (min-width: 1600px) 120vw, (min-width: 1400px) 110vw, (min-width: 1000px) 130vw, 150vw',
                  srcset: srcset(background.url, [400, 900, [1800, 'q_50'], [2600, 'q_30']])
                }, background.dimensions)
              }

              const other = rest.length > 1 ? grid({ size: { md: `1of${rest.length < 3 ? 2 : 3}` } }, rest) : null

              // attach hashtag to first video
              if (hashtag) {
                first = html`
                  <div class="u-posRelative">
                    ${hashtag}
                    ${video(first, { first: true })}
                  </div>
                `
              } else {
                first = video(first, { first: true })
              }

              blocks.push(html`
                <div class="u-narrow">
                  ${trailer(bgProps, first, other)}
                </div>
              `)
            }
          }

          // teams are just listed one after another
          doc.data.team.forEach(function (slice) {
            if (!slice.items.length) return
            if (slice.slice_type !== 'group') return
            if (!slice.primary.heading.length) return

            var opts = { size: { md: '1of3', lg: '1of4' } }
            var heading = asText(slice.primary.heading)
            var hasImage = slice.items.find((item) => item.image.url)
            if (hasImage) opts.size.xs = '1of2'
            else opts.size.md = '1of3'

            blocks.push(html`
              <div class="u-container u-pushDown">
                <div class="Text u-spaceB4">
                  <h2>${heading}</h2>
                </div>
                ${grid(opts, slice.items.map(teamMember))}
              </div>
            `)
          })
        }

        // resource link and blurb
        if (doc.data.resource_heading.length) {
          const blurb = doc.data.resource_blurb
          let content = html`
            <div>
              <div class="Text Text--large">
                <h2>${asText(doc.data.resource_heading)}</h2>
                ${asElement(doc.data.resource_text, resolve, serialize)}
              </div>
              ${doc.data.resource_link.url ? button({
                class: 'u-spaceT4 u-spaceB2',
                icon: symbol.download(),
                href: resolve(doc.data.resource_link),
                text: doc.data.resource_link_text || text(`Download ${filetype}`)
              }) : null}
            </div>
          `

          if (blurb.id) {
            content = grid([
              grid.cell({ size: { md: '1of2', lg: '2of3' } }, content),
              grid.cell({ size: { md: '1of2', lg: '1of3' } }, html`
                <div class="u-bgGrayLight">
                  <div class="Text u-paddedBox">
                    <p class="Text-fat Text-large">${asText(blurb.data.description)}</p>
                    <strong>
                      <a href="${resolve(blurb)}">
                        ${blurb.data.cta || text`Read more`}
                      </a>
                    </strong>
                  </div>
                </div>
              `)
            ])
          }

          blocks.push(html`
            <div class="u-container">
              <hr>
              ${content}
            </div>
          `)
        }

        // list upcoming dates
        if (doc.data.dates.length) {
          let page = +state.query.page
          if (isNaN(page) || page < 1) page = 1
          page = Math.min(page, Math.max(Math.ceil(doc.data.dates.length / 4), 0))

          // sort out future dates
          const today = startOfDay(Date.now())
          const dates = doc.data.dates
            .map(function (item) {
              if (!item.date) return null

              var status = item.status.match(/^\d+/)
              status = status ? +status[0] : null

              var href = item.link.url || resolve(item.link)
              var date = parse(item.date)
              var time = item.time.match(TIME_REG)
              if (time) {
                date.setHours(+time[1])
                date.setMinutes(+time[2])
              }
              return Object.assign({}, item, { date, href, status })
            })
            .filter((item) => item && item.date > today)
            .sort((a, b) => a.date > b.date ? 1 : -1)

          if (dates.length) {
            blocks.push(html`
              <div class="u-spaceV8">
                <section class="u-narrow u-container" id="${doc.id}-dates">
                  <hr class="u-spaceB8" />
                  ${doc.data.dates_heading.length ? html`
                    <div class="Text u-sizeFull u-textCenter ${collapse ? 'u-spaceB4' : 'u-spaceB7'}">
                      <h2>${asText(doc.data.dates_heading)}</h2>
                    </div>
                  ` : null}
                  ${grid({ slim: true, size: { md: '1of2', xl: '1of3' } }, dates.slice(0, page * 4).map(function (item, index, list) {
                    var prev = (page - 1) * 4
                    var attrs = { class: 'u-sizeFull' }
                    if (state.referrer && index >= prev) {
                      attrs.class += ' u-slideUp'
                      attrs.style = `animation-delay: ${(index - prev) * 200}ms;`
                    }
                    return html`<div ${attrs}>${ticket(item, () => emit('track:purchase', title))}</div>`
                  }))}
                  ${dates.length > page * 4 ? pagination({ href: `${state.href}?page=${page + 1}`, onclick: paginate }) : null}
                </section>
              </div>
            `)
          }
        }

        return html`
          <div>
            <header class="u-container">
              ${intro({
                badge: [doc.data.category, doc.data.subheading].filter(Boolean).join(' – '),
                title: title,
                text: asElement(doc.data.description, resolve, serialize),
                slot: videos.length ? null : hashtag,
                image: doc.data.image.url ? Object.assign({
                  alt: doc.data.image.alt || '',
                  sizes: '100vw',
                  srcset: srcset(
                    doc.data.image.url,
                    [400, 600, 800, 1200, [1800, 'q_80'], [2600, 'q_50']]
                  ),
                  src: srcset(doc.data.image.url, [900]).split(' ')[0]
                }, doc.data.image.dimensions) : null
              })}
            </header>
            ${blocks}
          </div>
        `
      })}
      <div class="u-container">
        ${intro({
          title: text`On stage right now`,
          blurb: true,
          action: button({
            primary: true,
            href: '/scen',
            icon: symbol.arrow(),
            text: text`Explore`
          })
        })}
      </div>
    </main>
  `

  // prevent adding pagination to history
  // obj -> void
  function paginate (event) {
    emit('replaceState', event.target.href, { persistScroll: true })
    event.preventDefault()
  }

  // render media element from slice
  // (obj, num) -> Element
  function mediaSlice (slice, index) {
    switch (slice.slice_type) {
      case 'image': {
        if (!slice.primary.image.url) return null
        return figure({
          image: slice.primary.image,
          caption: slice.primary.caption,
          sources: [400, 599, 900, [1500, 'q_40']],
          sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw'
        })
      }
      case 'quote': {
        if (!slice.primary.text.length) return null
        const blockquote = state.cache(Blockquote, `event-media-${index}`)
        return blockquote.render({
          content: asElement(slice.primary.text, resolve, serialize),
          caption: asElement(slice.primary.cite, resolve, serialize)
        })
      }
      case 'spotify': {
        if (!slice.primary.uri.embed_url) return null
        const body = slice.primary.text && slice.primary.text.length ? asElement(slice.primary.text, resolve, serialize) : null
        return spotify(slice.primary.uri.embed_url, body)
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
      src: `/media/${provider}/w_${opts.first ? 900 : 400}/${id}`,
      width: props.thumbnail_width,
      height: props.thumbnail_height,
      sizes: opts.first ? '(min-width: 600px) 65vw, 100vw' : '50vw',
      srcset: srcset(id, [400, 900, 1800, [2600, 'q_50']], { type: provider })
    }, opts))
  }
}

// render team member
// obj -> Element
function teamMember (props) {
  var image
  if (props.image.url) {
    const sources = srcset(props.image.url, [200, 400, [800, 'q_50']])
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

function meta (state) {
  return state.prismic.getByUID('event', state.params.slug, (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: doc.data.shortname && doc.data.shortname.length ? asText(doc.data.shortname) : asText(doc.data.title),
      description: asText(doc.data.description),
      'theme-color': doc.data.theme
    }

    var image = doc.data.featured_image
    if (!image.url) image = doc.data.poster
    if (!image.url) image = doc.data.image
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
