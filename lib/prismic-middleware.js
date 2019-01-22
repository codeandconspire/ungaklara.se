var { Predicates } = require('prismic-javascript')

// page types which all have featured fields used for links
var types = ['about', 'event', 'events', 'page', 'pedagogue', 'practical']
var fields = ['cta', 'title', 'theme', 'description', 'featured_image']

module.exports = middleware

function middleware (predicates, opts) {
  var fetchLinks = opts.fetchLinks = (opts.fetchLinks || [])

  for (let i = 0, len = types.length; i < len; i++) {
    fetchLinks.push(...fields.map((field) => types[i] + '.' + field))
  }

  if (predicates[0] === Predicates.at('document.type', 'website')) {
    fetchLinks.push(
      'about.title',
      'events.title',
      'pedagogue.title',
      'practical.title'
    )
  }
}
