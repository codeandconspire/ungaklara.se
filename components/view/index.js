var assert = require('assert')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Component = require('choo/component')
var error = require('./error')
var header = require('../header')
var footer = require('../footer')
var { i18n, asText } = require('../base')

var text = i18n()

var DEFAULT_TITLE = text`SITE_NAME`

module.exports = View

// view constructor doubles as view factory
// if not called with the `new` keyword it will just return a wrapper function
// (str|fn, fn?) -> View|fn
function View (view, meta) {
  if (!(this instanceof View)) return createView(view, meta)
  var id = view
  assert(typeof id === 'string', 'View: id should be type string')
  Component.call(this, id)
  this.createElement = createView(this.createElement, this.meta)
}

View.prototype = Object.create(Component.prototype)
View.prototype.constructor = View
View.prototype.meta = function () {
  throw new Error('View: meta should be implemented')
}
View.createView = createView
View.createClass = createClass

function createClass (Class, id) {
  return function (state, emit) {
    return state.cache(Class, id).render(state, emit)
  }
}

function createView (view, meta) {
  return function (state, emit) {
    var self = this

    return state.prismic.getSingle('website', function (err, doc) {
      var children
      try {
        if (err) throw err
        children = view.call(self, state, emit)
        let next = meta ? meta.call(self, state) : {}

        if (next.title && next.title !== DEFAULT_TITLE) {
          next.title = `${next.title} | ${DEFAULT_TITLE}`
        }
        emit('meta', Object.assign({
          title: doc && asText(doc.data.title),
          description: doc && asText(doc.data.description),
          'og:image': doc && doc.data.default_share_image.url
        }, next))
      } catch (err) {
        if (state.prefetch) throw err
        err.status = err.status || 500
        children = error(err)
        emit('meta', { title: `${text`Oops`} | ${DEFAULT_TITLE}` })
      }

      return html`
        <body class="View" id="view">
          <script type="application/ld+json">${raw(JSON.stringify(linkedData(state)))}</script>
          ${header()}
          <div class="View-main">
            ${children}
          </div>
          ${footer()}
        </body>
      `

      // format document as schema-compatible linked data table
      // obj -> obj
      function linkedData (state) {
        return {
          '@context': 'http://schema.org',
          '@type': 'Organization',
          name: DEFAULT_TITLE,
          url: state.origin,
          logo: state.origin + '/icon.png'
        }
      }
    })
  }
}
