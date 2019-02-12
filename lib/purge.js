var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')
var { resolve } = require('../components/base')

var REPOSITORY = 'https://unga-klara.cdn.prismic.io/api/v2'

module.exports = purge

function purge (urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  cccpurge(require('../index'), {
    urls: urls,
    resolve: resolveRoute,
    root: `https://${process.env.npm_package_now_alias}`,
    zone: process.env.CLOUDFLARE_ZONE,
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY
  }, callback)
}

function resolveRoute (route, done) {
  switch (route) {
    case '/pa-scen/:slug': {
      return Prismic.api(REPOSITORY).then(function (api) {
        var queue = [
          '/pa-scen/kalendarium',
          '/pa-scen/arkiv'
        ]

        queue.push(api.query(
          Prismic.Predicates.at('document.type', 'event')
        ).then((response) => response.results.map(resolve)))

        return Promise.all(queue).then(function (urls) {
          done(null, urls.reduce((flat, list) => flat.concat(list), []))
        }).catch(done)
      })
    }
    case '/:slug': {
      return Prismic.api(REPOSITORY).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'page')
        ).then(function (response) {
          done(null, response.results.map(resolve))
        }).catch(done)
      })
    }
    default: return done(null)
  }
}
