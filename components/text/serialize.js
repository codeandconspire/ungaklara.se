var html = require('choo/html')
var { Elements } = require('prismic-richtext')
var { srcset } = require('../base')

module.exports = serialize

function serialize (type, node, content, children) {
  switch (type) {
    case Elements.image: {
      let sizes = [400, 600, 800, 1200].map(function (size, index) {
        return Math.min(size, node.dimensions.width * (index + 1))
      })
      let src = node.url
      let attrs = { alt: node.alt || '' }
      if (!/\.svg$/.test(node.url)) {
        attrs.sizes = '39em'
        attrs.srcset = srcset(node.url, sizes)
        src = srcset(node.url, [800]).split(' ')[0]
      }
      return html`
        <figure>
          <img ${attrs} src="${src}">
          ${node.copyright ? html`<figcaption><small class="Text-muted">${node.copyright}</small></figcaption>` : null}
        </figure>
      `
    }
    default: return null
  }
}
