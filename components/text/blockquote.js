var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Blockquote extends Component {
  constructor (id, state) {
    super(id)
    var variant = Math.ceil(Math.random() * 2)
    if (typeof window !== 'undefined') {
      let el = document.getElementById(id)
      if (el) variant = el.dataset.variant
    }
    this.local = state.components[id] = { id, variant }
  }

  update () {
    return false
  }

  createElement (content, caption) {
    return html`
      <figure class="Text Text-blockquote Text-blockquote--variant${this.local.variant}" data-variant="${this.local.variant}" id="${this.local.id}">
        <blockquote>${content}</blockquote>
        ${caption ? html`<figcaption class="Text-caption">${caption}</figcaption>` : null}
      </figure>
    `
  }
}
