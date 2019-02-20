var choo = require('choo')
var app = choo({ hash: false })
var middleware = require('./lib/prismic-middleware')
var REPOSITORY = 'https://unga-klara.cdn.prismic.io/api/v2'

app.state.origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : process.env.npm_package_now_alias

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('./stores/reset'))
app.use(require('./stores/ui'))
app.use(require('./stores/favicon'))
app.use(require('./stores/navigation'))
app.use(require('./stores/prismic')({ repository: REPOSITORY, middleware }))
app.use(require('choo-meta')({ origin: app.state.origin }))
app.use(require('choo-service-worker')('/sw.js'))

/**
 * 1. Clumpsy workaround for supporting wildcard parent path
 * 2. Discard parent slug by letting tail override the `slug` param
 */

app.route('/', require('./views/home'))
app.route('/scen', require('./views/events'))
app.route('/scen/:slug', require('./views/event'))
app.route('/pedagoger', require('./views/teachers'))
app.route('/pedagoger/:slug', require('./views/page')) /* 1 */
app.route('/besoket', require('./views/visit'))
app.route('/besoket/:slug', require('./views/visit')) /* 1 */
app.route('/:slug/:slug', require('./views/page')) /* 2 */
app.route('/:slug', require('./views/page'))

try {
  module.exports = app.mount('body')
  // remove parse guard added in header
  window.onerror = null
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.removeAttribute('scripting-enabled')
    document.documentElement.setAttribute('scripting-initial-only', '')
  }
}
