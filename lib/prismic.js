var { Predicates } = require('prismic-javascript')

module.exports = middleware

function middleware (predicates, opts) {
  if (predicates[0] === Predicates.at('document.type', 'website')) {
    opts.fetchLinks = [
      'about.title',
      'events.title',
      'pedagogue.title',
      'practical.title'
    ]
  }
}
