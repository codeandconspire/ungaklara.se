var html = require('choo/html')

module.exports = facts

// themed facts box
// arr -> Element
function facts (items) {
  var count = items.length
  return html`
    <dl class="FactsBox">
      ${items.map(function (item, index) {
        var cols
        if (count >= 6) cols = 3
        if (count <= 4) cols = count
        if (count === 5) cols = index < 4 ? 3 : 2
        return html`
          <div class="FactsBox-cell u-size1of${cols}">
            <dt class="FactsBox-label">${item.label}</dt>
            <dd class="FactsBox-value">${item.text}</dd>
          </div>
        `
      })}
    </dl>
  `
}
