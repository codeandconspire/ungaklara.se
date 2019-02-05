var html = require('choo/html')
var { i18n } = require('../base')
var intro = require('../intro')

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
      <div class="Error">
        <img class="Error-img Error-img--1" alt="" src="/suzanne-osten-blink.gif" />
      </div>

      <div class="u-container">
        <div class="u-spaceB8">
          ${intro({ title: text`Oops`, text: message(err.status) })}
          ${DEBUG ? html`<pre class="u-bgWhite">${err.stack}</pre>` : null}
        </div>

      </div>
    </main>
  `
}

function message (status) {
  switch (status) {
    case 404: return html`<p>${text`There is no page at this address. Try finding your way using the menu or from ${html`<a href="/">${text`the homepage`}</a>`}.`}</p>`
    case 503: return html`<p>${text`You seem to be offline. Check your network connection and ${html`<a href="" onclick=${reload}>${text`try again`}</a>`}.`}</p>`
    default: return html`<p>${text`We apologize, an error has occured on our site. It may be temporary and you could ${html`<a href="" onclick=${reload}>${text`try again`}</a>`} or go back to ${html`<a href="/">${text`the homepage`}</a>`}.`}</p>`
  }

  function reload (event) {
    window.location.reload()
    event.preventDefault()
  }
}
