var html = require('choo/html')
var sv = require('date-fns/locale/sv')
var format = require('date-fns/format')
var startOfDay = require('date-fns/start_of_day')
var framed = require('../framed')
var button = require('../button')
var { timestamp, i18n, capitalize, loader, hexToRgb } = require('../base')

var text = i18n()

module.exports = calendar
module.exports.loading = loading

function calendar (items) {
  items = items.slice()
  items.sort((a, b) => a.date > b.date ? 1 : -1)

  var rows = []
  for (let i = 0, len = items.length, day; i < len; i++) {
    let item = items[i]
    let date = startOfDay(item.date)
    let available = item.status !== 3
    let attrs = { class: 'Calendar-row' }
    if (item.theme) attrs.style = `--theme-color: ${hexToRgb(item.theme)};`
    if (item.appear) {
      attrs.style = attrs.style || ''
      attrs.class += ' u-slideUp'
      attrs.style += ` animation-delay: ${i * 100}ms;`
    }

    if (!day || date > day) {
      rows.push(html`
        <li ${attrs}>
          <h2 class="Calendar-day">
            ${capitalize(format(date, 'dddd, D MMMM YYYY', { locale: sv }))}
          </h2>
        </li>
      `)
    }

    rows.push(html`
      <li ${attrs}>
        ${item.image ? html`
          <div class="Calendar-poster">
            ${framed(Object.assign({ size: 'sm' }, item.image))}
          </div>
        ` : null}
        <div class="Calendar-body">
          <div>
            <a href="${item.href}" class="Calendar-link">${item.title}</a>
            <br>
            <div class="Calendar-meta">
              <span class="Calendar-time">${timestamp(item.date)}</span>
              <span class="Calendar-location">${item.location}</span>
            </div>
          </div>
          ${button({
            primary: true,
            href: item.link,
            disabled: !available,
            text: available ? text`Buy ticket` : text`Sold out`
          })}
        </div>
      </li>
    `)
  }

  return html`
    <ol class="Calendar">
      ${rows}
    </ol>
  `
}

function loading (count = 3) {
  var rows = []
  for (let i = 0; i < count; i++) {
    rows.push(html`
    <li class="Calendar-row u-slideUp" style="animation-delay: ${i * 100}ms;">
      <div class="Calendar-poster">
        ${framed.loading({ size: 'sm' })}
      </div>
      <div class="Calendar-body">
        <div>
          <span class="Calendar-link">${loader(6)}</span>
          <br>
          <div class="Calendar-meta">
            <span>${loader(2)}</span><br>
            <span>${loader(3)}</span>
          </div>
        </div>
      </div>
    </li>
  `)
  }
  return html`
    <ol class="Calendar is-loading">
      ${rows}
    </ol>
  `
}
