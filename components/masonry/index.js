var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var { vh } = require('../base')

module.exports = class Masonry extends Component {
  update () {
    return true
  }

  afterupdate (el) {
    this.unload()
    this.init(el)
  }

  load (el) {
    this.init(el)
  }

  init (el) {
    this.reflow(el)

    var height = el.offsetHeight
    var prev = window.innerWidth
    var top = el.offsetTop

    var onscroll = nanoraf(function () {
      var { scrollY } = window
      if (scrollY + vh() < top || scrollY > top + height) return
      let inview = scrollY + vh() - top
      let fraction = inview / height
      el.style.setProperty('--offset', fraction.toFixed(6))
    })

    var onresize = nanoraf(() => {
      var next = window.innerWidth
      if ((prev >= 1000 && next < 1000) || (prev < 1000 && next >= 1000)) {
        this.rerender()
        this.reflow(el)
        height = el.offsetHeight
        onscroll()
      }
      prev = next
    })

    window.addEventListener('resize', onresize)
    window.addEventListener('scroll', onscroll)
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  // redistribute column items to get equal height(-ish) cols
  // () -> void
  reflow (el) {
    var last = []
    var cols = [...el.querySelectorAll('.js-col')]

    for (let i = 0, len = cols.length, col; i < len; i++) {
      col = cols[i]
      if (col.childElementCount <= 1) continue
      last.push(...Array.prototype.slice.call(col.childNodes, -1))
      col.removeChild(col.lastElementChild)
    }

    for (let i = 0, len = last.length; i < len; i++) {
      var shortest = cols.reduce((min, el) => {
        var height = el.offsetHeight
        return !min || height < min.height ? { el, height } : min
      }, null)
      shortest.el.appendChild(last[i])
    }
  }

  createElement (items) {
    var cols = [[], []]
    if (typeof window !== 'undefined' && window.innerWidth >= 1000) {
      cols.push([])
    }

    for (let i = 0, len = items.length, col = 0; i < len; i++){
      cols[col].push(items[i])
      if (col === cols.length - 1) col = 0
      else col += 1
    }

    return html`
      <div class="Masonry">
        ${cols.map((cells, index) => html`
          <div class="Masonry-col Masonry-col--${index + 1} js-col">
            ${cells.map((cell) => html`<div class="Masonry-cell">${cell}</div>`)}
          </div>
        `)}
      </div>
    `
  }
}
