var { hexToRgb } = require('../components/base')

module.exports = ui

function ui (state, emitter) {
  state.ui = {
    isLoading: false
  }

  if (typeof window !== 'undefined') {
    emitter.on('meta', function (props) {
      var theme = props['theme-color']
      theme = theme && hexToRgb(theme)
      if (theme) {
        document.documentElement.style.setProperty('--theme-color', theme)
      } else {
        document.documentElement.style.removeProperty('--theme-color')
      }
    })
  }

  var queue = 0
  emitter.on('prismic:request', function () {
    queue++
    state.ui.isLoading = true
  })
  emitter.on('prismic:response', done)
  emitter.on('prismic:error', done)

  function done () {
    queue--
    state.ui.isLoading = queue !== 0
  }
}
