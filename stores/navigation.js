module.exports = navigation

function navigation (state, emitter, app) {
  emitter.on('pushState', function (href, opts = {}) {
    if (opts.silent) return
    window.requestAnimationFrame(function () {
      window.scrollTo(0, 0)
    })
  })
}
