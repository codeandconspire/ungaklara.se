var html = require('choo/html')
var button = require('../button')
var { i18n, loader } = require('../base')

var YEARS = []
var year = ((new Date()).getFullYear() + '').replace(/\d$/, '0')
while (+year >= 1970) {
  YEARS.push(year.toString())
  year -= 10
}

var text = i18n()

module.exports = filter
module.exports.loading = loading

function filter (tags, period, callback) {
  var selected = tags.find((item) => item.selected)
  return html`
    <form class="Filter" method="GET">
      <fieldset class="Filter-tags">
        <span class="Filter-label">${text`Show`}:</span>
        <label class="u-inlineBlock">
          <input class="Filter-toggle" type="radio" name="tag" value="" checked=${!selected} onchange=${onchange}>
          <span class="Filter-label Filter-label--interactive">${text`All`}</span>
        </label>
        ${tags.map((item) => html`
          <label class="u-inlineBlock">
            <input class="Filter-toggle" type="radio" name="tag" value="${item.tag}" checked=${item.selected} onchange=${onchange}>
            <span class="Filter-label Filter-label--interactive">${item.tag}</span>
          </label>
        `)}
      </fieldset>
      <label class="Filter-decade">
        <span class="Filter-label">${text`From decade`}:</span>
        <select name="period" class="Filter-select" onchange=${onchange}>
          <option value="" selected=${!period}>${text`All`}</option>
          ${YEARS.map((year) => html`
            <option value="${year}" selected=${year === period}>${text`The ${year}'s`}</option>
          `)}
        </select>
      </label>
      ${button({ type: 'submit', class: 'u-js-hiddenVisually u-spaceL4', text: text`Show` })}
    </form>
  `

  function onchange (event) {
    callback(event.target.name, event.target.value)
  }
}

function loading () {
  return html`
    <div class="Filter">
      <div class="Filter-tags">
        <span class="Filter-label">${text`Show`}:</span>
        <span class="Filter-label">${loader(3)}</span>
        <span class="Filter-label">${loader(3)}</span>
        <span class="Filter-label">${loader(3)}</span>
      </div>
    </div>
  `
}
