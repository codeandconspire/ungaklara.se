var html = require('choo/html')
var view = require('../components/view')

module.exports = view(home)

function home () {
  return html`
    <main class="View-main">
      <div class="u-container">
        <h1>Hellooo!</h1>
      </div>
    </main>
  `
}
