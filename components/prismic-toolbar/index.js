var html = require('choo/html')

module.exports = class PrismicToolbar {
  constructor (id, state, emit) {
    this.emit = emit
    this.loaded = false
    this.enabled = state.preview
  }

  load () {
    if (this.loaded) return
    this.loaded = true
    window.prismic = window.prismic || {}
    window.prismic.endpoint = 'https://unga-klara.prismic.io/api/v2'
    window.document.head.appendChild(html`
      <script src="//static.cdn.prismic.io/prismic.min.js" async onload=${() => this.emit('render')}></script>
    `)
  }

  render () {
    if (!this.enabled || typeof window === 'undefined') return null
    if (!this.loaded) window.requestAnimationFrame(this.load.bind(this))
    var el = document.getElementById('io-prismic-toolbar')
    return el || html`<iframe></iframe>`
  }
}
