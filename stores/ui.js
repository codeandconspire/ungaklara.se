module.exports = ui

function ui (state, emitter) {
  state.ui = {
    isLoading: false
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
    state.ui.isLoading = queue === 0
  }
}
