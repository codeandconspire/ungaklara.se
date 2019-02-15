var html = require('choo/html')
var view = require('../components/view')
var button = require('../components/button')
var intro = require('../components/intro')
var framed = require('../components/framed')
var jigsaw = require('../components/jigsaw')
var { srcset } = require('../components/base')

module.exports = view(home, meta)

function home () {
  return html`
    <main class="View-main">
      ${jigsaw(
          intro({
            collapse: true,
            title: 'På turné!',
            text: html`<div><p>Botkyrka Halmstad Istanbul Malmö Rinkeby Helsingborg Bagarmossen Nacka Kapstaden Göteborg</p>`
          }),
          html`
            <div class="View-action">
              ${button({ text: 'Läs mer', href: '/unga-klara-on-tour-2019', primary: true })}
            </div>
          `,
          framed(Object.assign({
            srcset: srcset('https://prismic-io.s3.amazonaws.com/unga-klara%2F0b48e955-b36e-4b63-9dd6-77532cf860ef_on-tour.gif', [200, 400, [800, 'q_50']], { aspect: 800 / 800, transforms: 'c_thumb' }),
            sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw',
            src: srcset('https://prismic-io.s3.amazonaws.com/unga-klara%2F0b48e955-b36e-4b63-9dd6-77532cf860ef_on-tour.gif', [200]).split(' ')[0]
          }, {width: 800, height: 800})),
          null, true
        )}
    </main>
  `
}

function meta (state) {
  var props = {
    'theme-color': '156, 252, 35'
  }
  return props
}
