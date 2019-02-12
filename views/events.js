var html = require('choo/html')
var parse = require('date-fns/parse')
var asElement = require('prismic-element')
var addYears = require('date-fns/add_years')
var endOfDay = require('date-fns/end_of_day')
var startOfDay = require('date-fns/start_of_day')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var grid = require('../components/grid')
var card = require('../components/card')
var intro = require('../components/intro')
var framed = require('../components/framed')
var filter = require('../components/filter')
var button = require('../components/button')
var tablist = require('../components/tablist')
var calendar = require('../components/calendar')
var serialize = require('../components/text/serialize')
var { asText, resolve, i18n, hexToRgb, loader, srcset } = require('../components/base')

var text = i18n()
var PAGE_SIZE = 9
var TIME_REG = /(\d{2})(?:.|:)(\d{2})/

module.exports = view(event, meta)

function event (state, emit) {
  var { slug } = state.params
  var page = parseInt(state.query.page, 10)
  if (isNaN(page)) page = 1

  return html`
    <main class="View-main">
      ${state.prismic.getSingle('events', (err, doc) => {
        if (err) throw err

        var pages = []
        for (let i = 1; i <= page; i++) pages.push(...getPage(i))

        var tags = doc ? doc.data.filters.map((item) => Object.assign({
          selected: state.query.tag === item.tag
        }, item)) : null

        return html`
          <div class="u-container">
            ${doc ? intro({ title: asText(doc.data.title) }) : intro.loading({ text: false })}
            <div class="u-spaceT4">
              ${tablist({ static: true }, [{
                href: '/pa-scen',
                selected: !slug,
                text: text`Currently showing`,
                onclick: onselect
              }, {
                href: '/pa-scen/kalendarium',
                selected: slug === 'kalendarium',
                text: text`Calendar`,
                onclick: onselect
              }, {
                href: '/pa-scen/arkiv',
                selected: slug === 'arkiv',
                text: text`Archive`,
                onclick: onselect
              }])}
            </div>
            ${slug === 'arkiv'
              ? doc
                ? filter(tags, state.query.period, onfilter)
                : filter.loading()
              : null}
            ${!slug && doc && doc.data.notice.length ? html`
              <div class="u-spaceV6">
                <div class="Text">
                  ${asElement(doc.data.notice, resolve, serialize)}
                </div>
                <hr>
              </div>
            ` : null}
            ${list(pages)}
            <div class="Text u-sizeFull u-spaceV6 u-textCenter">
              ${pages && pages.length === page * PAGE_SIZE ? html`
                <a href="${getHrefWithParam('page', page + 1)}" onclick=${onpaginate}>
                  <strong>${text`Show more`}</strong>
                </a>
              ` : null}
            </div>
          </div>
        `
      })}
    </main>
  `

  function onpaginate (event) {
    if (state.ui.isLoading) return
    emit('replaceState', event.currentTarget.href, { persistScroll: true })
    event.preventDefault()
  }

  function onfilter (name, value) {
    emit('replaceState', getHrefWithParam(name, value), { persistScroll: true })
  }

  function onselect (event) {
    emit('pushState', event.currentTarget.href, { persistScroll: true })
    event.preventDefault()
  }

  function getHrefWithParam (name, value) {
    var query = state.query
    var url = `${state.href}?${name}=${value}`
    if (query.tag && name !== 'tag') url += `&tag=${query.tag}`
    if (query.period && name !== 'period') url += `&period=${query.period}`
    return url
  }

  // get paginated result for page
  // num -> arr
  function getPage (page) {
    let selector = slug === 'arkiv' ? 'dateBefore' : 'dateAfter'
    var predicates = [
      Predicates.at('document.type', 'event'),
      Predicates[selector]('my.event.archive_on', endOfDay(Date.now()))
    ]

    if (state.query.tag && state.query.tag !== 'on') {
      predicates.push(Predicates.at('document.tags', [state.query.tag]))
    }

    if (state.query.period) {
      let min = parse(state.query.period)
      let max = addYears(min, 10)
      predicates.push(
        Predicates.dateAfter('my.event.archive_on', min),
        Predicates.dateBefore('my.event.archive_on', max)
      )
    }

    var opts = {
      page: page,
      pageSize: slug === 'arkiv' ? PAGE_SIZE : 100
    }

    if (slug === 'arkiv') {
      opts.orderings = '[my.event.archive_on desc]'
    } else {
      opts.orderings = '[document.first_publication_date desc]'
    }

    return state.prismic.get(predicates, opts, (err, response) => {
      if (err) throw err

      if (!response) {
        let items = []
        for (let i = 0; i < PAGE_SIZE; i++) items.push(null)
        return items
      }

      if (slug) return response.results

      // sort currently showing events by premiere date
      return response.results
        .map(function (doc) {
          var premiere
          for (let i = 0, len = doc.data.dates.length; i < len; i++) {
            let date = parse(doc.data.dates[i].date)
            if (!premiere || date < premiere) premiere = date
          }
          return { doc, premiere }
        })
        .sort((a, b) => a.premiere > b.premiere ? -1 : 1)
        .map(({ doc }) => doc)
    })
  }

  // render document list
  // arr? -> Element
  function list (docs) {
    if (!docs.length) {
      return html`
        <div class="Text u-spaceV8 u-textCenter u-sizeFull">
          <p>${text`No more results`}</p>
        </div>
      `
    }

    switch (slug) {
      case undefined: {
        return html`
          <ol>
            ${docs.map(function (doc, index) {
              if (doc) return showing(doc, index)
              return html`
                <li class="u-spaceV6 u-slideUp" style="animation-delay: ${index * 200}ms;">
                  ${grid([
                    grid.cell({ size: { md: '1of4' } }, framed.loading()),
                    grid.cell({ size: { md: '3of4' } }, html`
                      <div class="u-spaceT4">
                        <div class="Text Text--large">
                          <small>${loader(3)}</small>
                          <h2 class="Text-h3 u-spaceT1">${loader(6)}</h2>
                          <div class="u-spaceT2">${loader(80)}</div>
                        </div>
                      </div>
                    `)
                  ])}
                </li>
              `
            })}
          </ol>
        `
      }
      case 'kalendarium': {
        if (!docs.find(Boolean)) return calendar.loading(6)
        return calendar(docs.reduce(function (dates, doc, index) {
          var title = asText(doc.data.title)
          var image
          if (doc.data.poster.url) {
            let sources = srcset(doc.data.poster.url, [75, 150, [300, 'q_50']])
            image = Object.assign({
              srcset: sources,
              sizes: '4.5rem',
              alt: doc.data.poster.alt || '',
              src: sources.split(' ')[0]
            }, doc.data.poster.dimensions)
          }

          for (let i = 0, len = doc.data.dates.length; i < len; i++) {
            let item = doc.data.dates[i]
            if (!item.date) continue

            let date = parse(item.date)
            if (date < startOfDay(Date.now())) continue
            let status = +item.status.match(/^\d+/)
            let time = item.time && item.time.match(TIME_REG)
            if (time) {
              date.setHours(+time[1])
              date.setMinutes(+time[2])
            }

            dates.push(Object.assign({
              href: resolve(doc),
              theme: doc.data.theme,
              appear: index + 1 > PAGE_SIZE || Boolean(state.referrer)
            }, item, { title, image, date, status, link: resolve(item.link) }))
          }

          return dates
        }, []))
      }
      case 'arkiv': {
        return grid({ ordered: true, size: { md: '1of3' } }, docs.map(function (doc, index) {
          var isLastBatch = page > 1 && index >= (PAGE_SIZE * page) - PAGE_SIZE
          var attrs = { class: 'u-sizeFull' }
          if (isLastBatch || Boolean(state.referrer)) {
            attrs.class += ' u-slideUp'
            attrs.style = `animation-delay: ${(index - ((PAGE_SIZE * page) - PAGE_SIZE)) * 200}ms;`
          }
          return html`
            <div ${attrs}>
              ${doc ? archived(doc) : card.loading()}
            </div>
          `
        }))
      }
      default: return null
    }
  }

  // render currently showing event
  // obj -> Element
  function showing (doc, index) {
    var attrs = index + 1 > PAGE_SIZE || Boolean(state.referrer) ? {
      class: 'u-spaceV6 u-slideUp',
      style: `animation-delay: ${index * 200}ms;`
    } : {}
    if (doc.data.theme) attrs.style = `--theme-color: ${hexToRgb(doc.data.theme)}`
    let image
    if (doc.data.poster.url) {
      let sources = srcset(doc.data.poster.url, [400, 600, [900, 'q_50']])
      image = Object.assign({
        srcset: sources,
        sizes: '25vw',
        alt: doc.data.poster.alt || '',
        src: sources.split(' ')[0]
      }, doc.data.poster.dimensions)
    }
    return html`
      <li ${attrs}>
        ${grid([
          grid.cell({ size: { md: '1of4' } }, image ? framed(image) : framed.loading()),
          grid.cell({ size: { md: '3of4' } }, html`
            <div class="u-spaceT4">
              <div class="Text Text--large u-spaceB4">
                <small class="u-textHeading u-textUppercase">
                  ${[doc.data.category, doc.data.subheading].filter(Boolean).join(' – ')}
                </small>
                <h2 class="Text-h3 u-spaceT1">${asText(doc.data.title)}</h2>
                <div class="u-spaceT2">
                  ${asElement(doc.data.description, resolve, serialize)}
                </div>
              </div>
              ${button({ text: text`Read more`, href: resolve(doc), primary: true, class: 'u-spaceR1' })}
            </div>
          `)
        ])}
      </li>
    `
  }
}

// render archived event
// obj -> Element
function archived (doc, index) {
  var props = {
    shrink: true,
    title: asText(doc.data.title),
    body: asText(doc.data.description),
    link: {
      href: resolve(doc),
      text: doc.data.cta || text`Read more`
    }
  }

  if (doc.data.poster.url) {
    let sources = srcset(doc.data.poster.url, [400, 600, [900, 'q_50']])
    props.image = Object.assign({
      srcset: sources,
      sizes: '(min-width: 600px) 33vw, 100vw',
      alt: doc.data.poster.alt || '',
      src: sources.split(' ')[0]
    }, doc.data.poster.dimensions)
  }

  return card(props, props.image ? null : html`
    <div class="u-loading u-aspectPoster"></div>
  `)
}

function meta (state) {
  return state.prismic.getSingle('events', (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description),
      'theme-color': doc.data.theme
    }

    var image = doc.data.featured_image
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
