var html = require('choo/html')
var view = require('../components/view')

module.exports = view(home)

function home () {
  return html`
    <main>Hellooo!</main>
  `
}
