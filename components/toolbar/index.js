var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')

var SCROLL_MAX = 125

module.exports = class Toolbar extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id,
      visible: 0,
      fixed: false
    }
  }

  update () {
    return false
  }

  load (element) {
    var offset
    var self = this
    var onscroll = nanoraf(function () {
      var { scrollY } = window
      if (scrollY < offset) {
        if (self.local.fixed) {
          self.local.fixed = false
          self.rerender()
        }
        return
      }
      var range = Math.min(Math.max(scrollY - offset, 0), SCROLL_MAX)
      self.local.visible = (range / SCROLL_MAX).toFixed(3)
      if (self.local.fixed) {
        element.style.setProperty('--Toolbar-visible', self.local.visible)
      } else {
        self.local.fixed = true
        self.rerender()
      }
    })
    var onresize = nanoraf(function () {
      if (self.local.fixed) element.classList.remove('is-fixed')
      offset = element.offsetTop
      var parent = element
      while ((parent = parent.offsetParent)) offset += parent.offsetTop
      if (self.local.fixed) element.classList.add('is-fixed')
      onscroll()
    })

    onresize()
    onscroll()
    window.addEventListener('resize', onresize)
    window.addEventListener('scroll', onscroll, { passive: true })
    return function () {
      window.removeEventListener('resize', onscroll)
      window.removeEventListener('scroll', onscroll)
    }
  }

  createElement (props) {
    if (!this.local.fixed) {
      return html`<nav class="Toolbar" id="${this.local.id}"></nav>`
    }

    return html`
      <nav class="Toolbar is-fixed" style="--Toolbar-visible: ${this.local.visible};" id="${this.local.id}">
        <div class="Toolbar-content u-container">
          ${props.heading ? html`
            <h2 class="Toolbar-heading">${props.heading}</h2>
          ` : null}
          <ul class="Toolbar-actions">
            ${props.actions.map((action) => html`
              <li class="Toolbar-action">${action}</li>
            `)}
          </ul>
        </div>
      </nav>
    `
  }
}
