module.exports = navigation

function navigation (state, emitter) {
  state.referrer = null

  emitter.prependListener('pushState', onnavigate)
  emitter.prependListener('replaceState', onnavigate)

  function onnavigate (href, opts = {}) {
    var url = new window.URL(href)
    if (url.pathname !== state.href) {
      if (!opts.persistScroll) {
        window.requestAnimationFrame(function () {
          window.scrollTo(0, 0)
        })
      }
      state.referrer = state.href
    }
  }
}
