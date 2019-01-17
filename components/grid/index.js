var html = require('choo/html')

module.exports = grid

// render children in grid cells
// (arr, obj?) -> Element
function grid (children, opts = {}) {
  return html`
    <div class="Grid">
      ${children.map(cell)}
    </div>
  `

  function cell (child, index) {
    var attrs = { class: 'Grid-cell' }

    var size = child.size || opts.size
    if (size) attrs.class += ' ' + sizes(size)

    if (opts.appear) {
      attrs.class += ' Grid-cell--appear'
      attrs.style = `animation-delay: ${index * 100}ms`
    }

    return html`
      <div ${attrs}>
        ${typeof child === 'function' ? child() : child}
      </div>
    `
  }
}

function sizes (opts) {
  var size = ''
  if (opts.xs) size += `u-size${opts.xs} `
  if (opts.sm) size += `u-sm-size${opts.sm} `
  if (opts.md) size += `u-md-size${opts.md} `
  if (opts.lg) size += `u-lg-size${opts.lg} `
  return size
}
