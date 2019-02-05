var html = require('choo/html')
var parse = require('date-fns/parse')
var asElement = require('prismic-element')
var endOfDay = require('date-fns/end_of_day')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var grid = require('../components/grid')
var intro = require('../components/intro')
var framed = require('../components/framed')
var button = require('../components/button')
var tablist = require('../components/tablist')
var calendar = require('../components/calendar')
var serialize = require('../components/text/serialize')
var { asText, resolve, i18n, hexToRgb, loader } = require('../components/base')

var text = i18n()
var PAGE_SIZE = 9
var TIME_REG = /(\d{2})(?:.|:)(\d{2})/

module.exports = view(event, meta)

function event (state, emit) {
  var { slug } = state.params
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getSingle('events', (err, doc) => {
          if (err) throw err

          var page = +state.query.page
          if (isNaN(page)) page = 1
          var pages = null
          for (let i = 0; i < page; i++) {
            let docs = getPage(i)
            if (docs) {
              pages = pages || []
              pages.push(...docs)
            }
          }

          var attrs = {}
          if (doc && doc.data.theme) {
            attrs.style = `--theme-color: ${hexToRgb(doc.data.theme)}`
          }

          return html`
            <div ${attrs}>
              <div class="u-spaceB8">
                ${doc ? intro({ title: asText(doc.data.title) }) : intro.loading({ text: false })}
                <div class="u-spaceT4">
                  ${tablist({ static: true }, [{
                    href: '/pa-scen',
                    selected: !slug,
                    text: text`Currently showing`,
                    onclick: onclick
                  }, {
                    href: '/pa-scen/kalendarium',
                    selected: slug === 'kalendarium',
                    text: text`Calendar`,
                    onclick: onclick
                  }, {
                    href: '/pa-scen/arkiv',
                    selected: slug === 'arkiv',
                    text: text`Archive`,
                    onclick: onclick
                  }])}
                </div>
                ${list(pages)}
                ${pages && pages.length === page * PAGE_SIZE ? button({
                  href: state.href + `?page=${page + 1}`,
                  disabled: state.ui.isLoading,
                  text: text`Show more` })
                : null}
              </div>
            </div>
          `
        })}
      </div>
    </main>
  `

  function onclick (event) {
    emit('pushState', event.target.href, { persistScroll: true })
    event.preventDefault()
  }

  // get paginated result for page
  // num -> arr
  function getPage (page) {
    var selector = slug === 'arkiv' ? 'dateBefore' : 'dateAfter'
    var predicates = [
      Predicates.at('document.type', 'event'),
      Predicates[selector]('my.event.archive_on', endOfDay(Date.now()))
    ]

    var opts = {
      page: page,
      pageSize: slug === 'kalendarium' ? PAGE_SIZE : 100,
      orderings: '[document.first_publication_date desc]'
    }

    return state.prismic.get(predicates, opts, (err, response) => {
      if (err) throw err
      return response ? response.results : null
    })
  }

  // render document list
  // arr? -> Element
  function list (docs) {
    if (docs && !docs.length) {
      return html`
        <div class="Text u-spaceV8 u-textCenter u-sizeFull">
          <p>${text`No more results`}</p>
        </div>
      `
    }

    switch (slug) {
      case undefined: {
        let items = []
        if (docs) {
          items = docs.map(showing)
        } else {
          for (let i = 0; i < 6; i++) {
            items.push(html`
              <li class="u-spaceV6">
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
            `)
          }
        }

        return html`
          <ol class="u-spaceV8">
            ${items}
          </ol>
        `
      }
      case 'kalendarium': {
        if (!docs) return calendar.loading(6)
        return calendar(docs.reduce((dates, doc) => {
          var title = asText(doc.data.title)
          var image = Object.assign({
            src: doc.data.poster.url
          }, doc.data.poster.dimensions)

          for (let i = 0, len = doc.data.dates.length; i < len; i++) {
            let item = doc.data.dates[i]
            if (!item.date) continue

            let date = parse(item.date)
            let status = +item.status.match(/^\d+/)
            let time = item.time && item.time.match(TIME_REG)
            if (time) {
              date.setHours(+time[1])
              date.setMinutes(+time[2])
            }

            dates.push(Object.assign({
              href: resolve(doc)
            }, item, { title, image, date, status }))
          }

          return dates
        }, []))
      }
      default: return null
    }
  }
}

// render currently showing event
// obj -> Element
function showing (doc) {
  var attrs = { class: 'u-spaceV6' }
  if (doc.data.theme) attrs.style = `--theme-color: ${hexToRgb(doc.data.theme)}`
  return html`
    <li ${attrs}>
      ${grid([
        grid.cell({ size: { md: '1of4' } }, framed(Object.assign({
          src: doc.data.poster.url
        }, doc.data.poster.dimensions))),
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
