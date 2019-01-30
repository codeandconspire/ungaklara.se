var url = require('url')
var jalla = require('jalla')
var { get } = require('koa-route')
var Prismic = require('prismic-javascript')
var { resolve } = require('./components/base')

var REPOSITORY = 'https://unga-klara.cdn.prismic.io/api/v2'

var app = jalla('index.js', { sw: 'sw.js' })

app.use(get('/api/prismic-preview', async function (ctx) {
  var host = process.env.NOW_URL && url.parse(process.env.NOW_URL).host
  if (host && ctx.host !== host) {
    return ctx.redirect(url.resolve(process.env.NOW_URL, ctx.url))
  }
  var token = ctx.query.token
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  var href = await api.previewSession(token, resolve, '/')
  ctx.redirect(href)
}))

app.use(function (ctx, next) {
  ctx.state.preview = ctx.cookies.get(Prismic.previewCookie)
  return next()
})

app.listen(8080)
