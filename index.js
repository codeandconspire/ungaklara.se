var choo = require('choo')
var app = choo({ hash: false })

var REPOSITORY = 'https://unga-klara.cdn.prismic.io/api/v2'

app.state.origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : process.env.npm_package_now_alias

if (process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('./stores/reset'))
app.use(require('./stores/prismic')({ repository: REPOSITORY }))
app.use(require('choo-meta')({ origin: app.state.origin }))
app.use(require('choo-service-worker')('/sw.js'))

app.route('/', require('./views/home'))
app.route('/pa-scen/:event', require('./views/event'))

module.exports = app.mount('body')
