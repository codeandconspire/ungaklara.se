var html = require('choo/html')
var { Elements } = require('prismic-richtext')
var { resolve } = require('../base')
var serialize = require('./serialize')

module.exports = reset

// format links as inline text
// (str, obj, any, arr) -> Element
function reset (type, node, content, children) {
  switch (type) {
    case Elements.hyperlink: {
      const attrs = { href: resolve(node.data), class: 'Text-reset' }
      if (node.data.target && node.data.target === '_blank') {
        attrs.target = node.data.target
        if (node.data.target === '_blank') {
          attrs.rel = 'noopener noreferrer'
        }
      }
      return html`<a ${attrs}>${children}</a>`
    }
    default: return serialize(type, node, content, children)
  }
}
