var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

var DEBUG = process.env.NODE_ENV === 'development'
if (typeof window !== 'undefined') {
  try {
    let flag = window.localStorage.DEBUG
    DEBUG = DEBUG || (flag && JSON.parse(flag))
  } catch (err) {}
}

module.exports = error

function error (err) {
  return html`
    <main class="View-main">
      <div class="u-container">
        <div class="u-spaceV8">
          <div class="Text Text--center">
            <h1>${text`Oops`}</h1>
            ${err.status === 404 ? html`
              <p>
                ${text`There is no page at this address. Try finding your way using the menu or from` + ' '}
                <a href="/">${text`the homepage`}</a>.
              </p>
            ` : html`
              <p>
                ${text`We apologize, an error has occured on our site. It may be temporary and you could` + ' '}
                <a href="" onclick=${reload}>${text`try again`}</a>
                ${' ' + text`or go back to` + ' '}
                <a href="/">${text`the homepage`}</a>.
              </p>
            `}
            ${DEBUG ? html`<pre>${err.stack}</pre>` : null}
          </div>
        </div>
      </div>
    </main>
  `

  function reload (event) {
    window.location.reload()
    event.preventDefault()
  }
}
