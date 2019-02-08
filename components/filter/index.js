var html = require('choo/html')
var { i18n, loader } = require('../base')

var text = i18n()

module.exports = filter
module.exports.loading = loading

function filter (tags, callback) {
  var selected = tags.find((item) => item.selected)
  return html`
    <form class="Filter" method="GET">
      <fieldset class="Filter-tags">
        <legend class="Filter-label">${text`Show:`}</legend>
        <label>
          <input class="Filter-toggle" type="radio" name="tag" value="" checked=${!selected} onchange=${onchange}>
          <span class="Filter-label">${text`All`}</span>
        </label>
        <div class="Filter-options">
          ${tags.map((item) => html`
            <label>
              <input class="Filter-toggle" type="radio" name="tag" value="${item.tag}" checked=${item.selected} onchange=${onchange}>
              <span class="Filter-label">${item.tag}</span>
            </label>
          `)}
        </div>
      </fieldset>
      <input type="submit" class="u-hiddenVisually">
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
        <span class="Filter-label">${text`Show:`}</span>
        <span class="Filter-label">${loader(3)}</span>
        <span class="Filter-label">${loader(3)}</span>
        <span class="Filter-label">${loader(3)}</span>
      </div>
    </div>
  `
}
