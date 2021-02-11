if (!process.env.HEROKU) require('dotenv/config')

var jalla = require('jalla')
var dedent = require('dedent')
var body = require('koa-body')
var compose = require('koa-compose')
var { get, post } = require('koa-route')
var Prismic = require('prismic-javascript')
var purge = require('./lib/purge')
var { resolve } = require('./components/base')
var subscribe = require('./lib/mailchimp-proxy')
var imageproxy = require('./lib/cloudinary-proxy')

var REPOSITORY = 'https://unga-klara.cdn.prismic.io/api/v2'
var MAILCHIMP = 'https://ungaklara.us1.list-manage.com/subscribe/post?u=b07292bdb82e39f1819a83c1a&amp;id=6a10f52682'

var app = jalla('index.js', {
  sw: 'sw.js',
  serve: process.env.NODE_ENV === 'production'
})

// proxy cloudinary on-demand-transform API
app.use(get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri) {
  if (ctx.querystring) uri += `?${ctx.querystring}`
  var stream = await imageproxy(type, transform, uri)
  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, stream.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = stream
}))

app.use(compose([
  // expose mailchimp endpoint on state
  function (ctx, next) {
    ctx.state.mailchimp = MAILCHIMP
    return next()
  },
  // newsletter subscription endpoint
  post('/api/subscribe', compose([body(), async function (ctx, next) {
    ctx.set('Cache-Control', 'private, no-cache')
    ctx.body = await subscribe(ctx.request.body, MAILCHIMP)
  }]))
]))

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
  var token = ctx.query.token
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  var href = await api.previewSession(token, resolve, '/')
  var expires = app.env === 'development'
    ? new Date(Date.now() + (1000 * 60 * 60 * 12))
    : new Date(Date.now() + (1000 * 60 * 30))

  ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  ctx.cookies.set(Prismic.previewCookie, token, {
    expires: expires,
    httpOnly: false,
    path: '/'
  })
  ctx.redirect(href)
}))

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
    const doc = await api.getByUID('page', slug)
    if (!doc.data.parent || !doc.data.parent.id) return next()
    ctx.redirect(resolve(doc))
  } catch (err) {
    return next()
  }
}))

// prevent cache of queried archive pages as they change periodically
app.use(get('/scen/arkiv', function (ctx, next) {
  if (Object.keys(ctx.query).length) {
    ctx.set('Cache-Control', 'private, no-cache, max-age=0')
  }
  return next()
}))

// expose common constants on state
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  ctx.state.repository = REPOSITORY
  ctx.state.origin = ctx.origin
  return next()
})

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

app.listen(process.env.PORT || 8080, function () {
  if (process.env.HEROKU && app.env === 'production') {
    purge(['/sw.js'], function (err) {
      if (err) app.emit('error', err)
    })
  }
})
