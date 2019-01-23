var html = require('choo/html')
var endOfDay = require('date-fns/end_of_day')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var grid = require('../components/grid')
var intro = require('../components/intro')
var framed = require('../components/framed')
var button = require('../components/button')
var tablist = require('../components/tablist')
var { asText, resolve, i18n, hexToRgb, loader } = require('../components/base')
var { serialize } = require('../components/text/serialize')

var text = i18n()
var PAGE_SIZE = 9

module.exports = view(event, meta)

function event (state, emit) {
  return html`
    <main class="View-main">
      <div class="u-container">
        ${state.prismic.getSingle('events', (err, doc) => {
          if (err) throw err

          var page = +state.query.page
          if (isNaN(page)) page = 1
          var pages = []
          for (let i = 0; i < page; i++) pages.push(...getPage(i))

          if (!doc) return intro.loading({ badge: true, image: true })

          var attrs = {}
          if (doc.data.theme) {
            attrs.style = `--theme-color: ${hexToRgb(doc.data.theme)}`
          }

          return html`
            <div ${attrs}>
              <div class="u-spaceB8">
                ${intro({ title: asText(doc.data.title) })}
                <div class="u-spaceT4">
                  ${tablist({ static: true }, [{
                    href: '/pa-scen',
                    selected: !state.params.slug,
                    text: text`Currently showing`,
                    onclick: onclick
                  }, {
                    href: '/pa-scen/kalendarium',
                    selected: state.params.slug === 'kalendarium',
                    text: text`Calendar`,
                    onclick: onclick
                  }, {
                    href: '/pa-scen/arkiv',
                    selected: state.params.slug === 'arkiv',
                    text: text`Archive`,
                    onclick: onclick
                  }])}
                </div>
                <ol class="u-spaceT8">
                  ${pages}
                  ${pages.length === page * PAGE_SIZE ? button({
                    href: state.href + `?page=${page + 1}`,
                    disabled: state.ui.isLoading,
                    text: text`Show more` })
                  : null}
                </ol>
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
    var predicates = [Predicates.at('document.type', 'event')]
    if (state.params.slug === 'arkiv') {
      predicates.push(
        Predicates.dateBefore('my.event.archive_on', endOfDay(Date.now()))
      )
    } else {
      predicates.push(
        Predicates.dateAfter('my.event.archive_on', endOfDay(Date.now()))
      )
    }

    var opts = {
      page: page,
      pageSize: PAGE_SIZE,
      orderings: '[document.first_publication_date desc]'
    }

    return state.prismic.get(predicates, opts, (err, response) => {
      if (err) throw err
      if (!response) {
        let items = []
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
        return items
      }

      if (!response.results_size) {
        if (page > 1) return []
        return [html`
          <li class="Text u-textCenter u-sizeFull">
            <p>${text`No more results`}</p>
          </li>
        `]
      }

      return response.results.map((doc) => html`
        <li>
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
      `)
    })
  }
}

function meta (state) {
  return state.prismic.getSingle('events', (err, doc) => {
    if (err) throw err
    if (!doc) return null
    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
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
