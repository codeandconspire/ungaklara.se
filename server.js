if (!process.env.NOW) require('dotenv/config')

var url = require('url')
var jalla = require('jalla')
var dedent = require('dedent')
var { get } = require('koa-route')
var Prismic = require('prismic-javascript')
var { resolve } = require('./components/base')
var imageproxy = require('./lib/cloudinary-proxy')

var REPOSITORY = 'https://unga-klara.cdn.prismic.io/api/v2'

var app = jalla('index.js', { sw: 'sw.js' })

// proxy cloudinary on-demand-transform API
app.use(get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri) {
  if (ctx.querystring) uri += `?${ctx.querystring}`
  var stream = await imageproxy(type, transform, uri)
  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, stream.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = stream
}))

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

app.use(get('/robots.txt', function (ctx, next) {
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: ${app.env === 'production' ? '' : '/'}
  `
}))

app.use(function (ctx, next) {
  ctx.state.preview = ctx.cookies.get(Prismic.previewCookie)
  return next()
})

app.listen(8080)
