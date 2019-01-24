var html = require('choo/html')

module.exports = class PrismicToolbar {
  render () {
    if (typeof window === 'undefined') return null
    var el = document.getElementById('io-prismic-toolbar')
    if (!el) return null
    var proxy = html`<iframe id="io-prismic-toolbar"></iframe>`
    proxy.isSameNode = function (node) {
      return node.id === 'io-prismic-toolbar'
    }
    return proxy
  }
}
