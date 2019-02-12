if (!process.env.NOW) require('dotenv/config')

var url = require('url')
var jalla = require('jalla')
var dedent = require('dedent')
var body = require('koa-body')
var compose = require('koa-compose')
var { get, post } = require('koa-route')
var Prismic = require('prismic-javascript')
var purge = require('./lib/purge')
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

// add webhook for prismic updates
app.use(post('/api/prismic-hook', compose([body(), function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_SECRET, 403, 'Secret mismatch')
  return new Promise(function (resolve, reject) {
    purge(function (err, response) {
      if (err) return reject(err)
      ctx.type = 'application/json'
      ctx.body = {}
      resolve()
    })
  })
}])))

// set preview cookie
app.use(get('/api/prismic-preview', async function (ctx) {
  var host = process.env.NOW_URL && url.parse(process.env.NOW_URL).host
  if (host && ctx.host !== host) {
    return ctx.redirect(url.resolve(process.env.NOW_URL, ctx.url))
  }

  var token = ctx.query.token
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  var href = await api.previewSession(token, resolve, '/')
  var expires = app.env === 'development'
    ? new Date(Date.now() + (1000 * 60 * 60 * 12))
    : new Date(Date.now() + (1000 * 60 * 30))

  ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  ctx.cookies.set(Prismic.previewCookie, token, { expires: expires, path: '/' })
  ctx.redirect(href)
}))

// set cache headers
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  var previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.state.ref = previewCookie
    ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  } else {
    ctx.state.ref = null
    if (app.env !== 'development') {
      ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 30}, max-age=0`)
    }
  }
  return next()
})

// disallow robots anywhere but live URL
app.use(get('/robots.txt', function (ctx, next) {
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: ${app.env === 'production' ? '' : '/'}
  `
}))

// redirect pages with parent to proper url
app.use(get('/:slug', async function (ctx, slug, next) {
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  try {
    let doc = await api.getByUID('page', slug)
    if (!doc.data.parent) return next()
    ctx.redirect(resolve(doc))
  } catch (err) {
    return next()
  }
}))

// prevent cache of queried archive pages as they change periodically
app.use(get('/pa-scen/arkiv', function (ctx, next) {
  if (Object.keys(ctx.query).length) {
    ctx.set('Cache-Control', 'private, no-cache, max-age=0')
  }
  return next()
}))

app.listen(process.env.PORT || 8080, function () {
  if (process.env.NOW && app.env === 'production') {
    purge(['/sw.js'], function (err) {
      if (err) app.emit('error', err)
    })
  }
})
