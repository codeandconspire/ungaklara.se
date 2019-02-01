var html = require('choo/html')
// var { i18n } = require('../base')
var Component = require('choo/component')
var nanoraf = require('nanoraf')

// var text = i18n()

class Cursor extends Component {
  update (type) {
    return this.type !== type
  }

  load (element) {
    var doc = document.documentElement

    var move = nanoraf(function (event) {
      element.style.setProperty('--x', event.clientX.toFixed(1) + 'px')
      element.style.setProperty('--y', event.clientY.toFixed(1) + 'px')
    })
    var down = () => element.classList.add('is-pressed')
    var up = () => element.classList.remove('is-pressed')
    var leave = () => element.classList.add('is-hidden')
    var enter = () => element.classList.remove('is-hidden')

    doc.addEventListener('mousemove', move)
    doc.addEventListener('mousedown', down)
    doc.addEventListener('mouseup', up)
    doc.addEventListener('mouseenter', enter)
    doc.addEventListener('mouseleave', leave)

    // this.unload = doc.removeEventListener('mousemove', move)
  }

  createElement (type = 'default') {
    this.type = type

    if (typeof window === 'undefined') return html`<div></div>`

    return html`
      <div class="Cursor Cursor--${type}">
        <div class="Cursor-item">
          <svg class="Cursor-default" width="17" height="31" viewBox="0 0 17 31">
            <path fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="2" d="M17.3529412,25.918552 L17.3529412,36 C17.3529412,36.5522847 16.9052259,37 16.3529412,37 L13.6470588,37 C13.0947741,37 12.6470588,36.5522847 12.6470588,36 L12.6470588,25.918552 L9.00624426,27.2208434 C8.48622513,27.4068502 7.91387799,27.1360798 7.72787115,26.6160606 C7.64926245,26.3962944 7.65000276,26.155954 7.72996381,25.9366762 L14.0605147,8.57635768 C14.2497216,8.0574943 14.8237259,7.79025487 15.3425893,7.97946171 C15.6198964,8.08058353 15.8383634,8.29905054 15.9394853,8.57635768 L22.2700362,25.9366762 C22.459243,26.4555396 22.1920036,27.0295439 21.6731402,27.2187507 C21.4538624,27.2987118 21.213522,27.2994521 20.9937557,27.2208434 L17.3529412,25.918552 Z" transform="rotate(-20 -8.85 41.644)"/>
          </svg>
        </div>
      </div>
    `
  }
}

module.exports = new Cursor()