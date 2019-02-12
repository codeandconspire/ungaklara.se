var html = require('choo/html')
var { Elements } = require('prismic-richtext')
var serialize = require('./serialize')

module.exports = cap

// cap heading to given size
// (str, obj, any, arr) -> Element
function cap (size) {
  return function serializer (type, node, content, children) {
    switch (type) {
      case Elements.heading1: return html`<h1 class="Text-${size}">${children}</h1>`
      case Elements.heading2: return html`<h2 class="Text-${size}">${children}</h2>`
      case Elements.heading3: return html`<h3 class="Text-${size}">${children}</h3>`
      case Elements.heading4: return html`<h4 class="Text-${size}">${children}</h4>`
      case Elements.heading5: return html`<h5 class="Text-${size}">${children}</h5>`
      case Elements.heading6: return html`<h6 class="Text-${size}">${children}</h6>`
      default: return serialize(type, node, content, children)
    }
  }
}
