module.exports = navigation

function navigation (state, emitter) {
  state.referrer = null

  emitter.on('pushState', function (href, opts = {}) {
    if (!opts.persistScroll) onnavigate(href)
  })

  emitter.on('replaceState', function (href, opts = {}) {
    if (!opts.persistScroll) onnavigate(href)
  })

  function onnavigate (href) {
    var url = new window.URL(href)
    if (url.pathname !== state.referrer) {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, 0)
      })
    }
    state.referrer = state.href
  }
}
