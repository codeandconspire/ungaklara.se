module.exports = navigation

function navigation (state, emitter, app) {
  emitter.on('pushState', function (href, opts = {}) {
    if (opts.persistScroll) return
    window.requestAnimationFrame(function () {
      window.scrollTo(0, 0)
    })
  })
}
