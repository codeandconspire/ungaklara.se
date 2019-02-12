module.exports = navigation

function navigation (state, emitter) {
  state.referrer = null

  emitter.prependListener('pushState', onnavigate)
  emitter.prependListener('replaceState', onnavigate)

  function onnavigate (href, opts = {}) {
    if (pathname(href) !== state.href) {
      if (!opts.persistScroll) {
        window.requestAnimationFrame(function () {
          window.scrollTo(0, 0)
        })
      }
      state.referrer = state.href
    }
  }
}

// reduce href to only its pathname
// str -> str
function pathname (href) {
  return href
    .replace(/^https?:\/\/.+?\//, '/')
    .replace(/\?.+$/, '')
    .replace(/\/$/, '')
    .replace(/#.+$/, '')
}
