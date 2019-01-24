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

  createElement ({ large = false, content, caption }) {
    return html`
      <div class="Text ${large ? 'Text--large' : ''}" data-variant="${this.local.variant}" id="${this.local.id}">
        <figure class="Text-blockquote Text-blockquote--variant${this.local.variant}">
          <blockquote>${content}</blockquote>
          ${caption ? html`<figcaption class="Text-caption">${caption}</figcaption>` : null}
        </figure>
      </div>
    `
  }
}
