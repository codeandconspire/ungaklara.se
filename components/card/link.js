var html = require('choo/html')
var assert = require('assert')
var { loader, i18n, isSameDomain, filetype } = require('../base')

var text = i18n(require('./lang.json'))

module.exports = link
link.loading = loading

function link (opts = {}) {
  assert(opts.href, 'link: href string is required')

  opts.file = opts.file ? opts.file : filetype(opts.href)
  opts.external = opts.external ? opts.external : !isSameDomain(opts.href)

  var attrs = { class: 'Card-link', href: opts.href }
  if (opts.external && !opts.file) {
    attrs.rel = 'noopener noreferrer'
    attrs.target = '_blank'
  }
  if (opts.file) attrs.download = ''

  return html`
    <a ${attrs}>
      ${label(opts)}
      ${opts.icon ? html`<span class="Card-icon">${opts.icon}</span>` : null}
    </a>
  `
}

function loading (opts = {}) {
  return html`<div><span class="u-loading">${loader(4)}</span></div>`
}

function label (opts) {
  if (opts.text) return opts.text
  if (opts.file) return text(`Download ${opts.file}`)
  if (opts.external) return text`Go to website`
  return text`Read more`
}
