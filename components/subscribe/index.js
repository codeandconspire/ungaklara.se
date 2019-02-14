var html = require('choo/html')
var Component = require('choo/component')
var { i18n } = require('../base')

var text = i18n()

module.exports = class Subscribe extends Component {
  constructor (id, state, emit) {
    super(id)
    this.cache = state.cache
    this.local = state.components[id] = {
      id: id,
      subscribed: false
    }
  }

  update () {
    return false
  }

  createElement (props) {
    var self = this

    return html`
      <form method="POST" action="${props.action}" class="Subscribe" onsubmit=${onsubmit} target="_blank" id="${this.local.id}">
        <div class="Text Text--large u-textCenter">
          ${props.title ? html`<h1>${props.title}</h1>` : null}
          ${this.local.subscribed ? html`
            <div class="u-spaceT3">
              ${props.success || html`<p>${text`Thanks for signing up!`}</p>`}
              <strong><a href="${props.action}" onclick=${onreset}>${text`Sign up another e-mail address`}</a></strong>
            </div>
          ` : props.body}
        </div>
        ${!this.local.subscribed ? html`
          <div class="Subscribe-form">
            ${props.ref ? html`<input type="hidden" name="REF" value="${props.ref}">` : null}
            <label class="Subscribe-label">
              <span class="u-hiddenVisually">${text`Enter your e-mail address`}</span>
              <input type="email" name="EMAIL" class="Subscribe-input" autocomplete="email" placeholder="${text`Enter your e-mail address`}" required>
            </label>
            <button type="submit" class="Subscribe-button js-button">
              ${text`Subscribe`}
            </button>
          </div>
        ` : null}
      </form>
    `

    function onreset (event) {
      self.local.subscribed = false
      self.rerender()
      event.preventDefault()
    }

    function onsubmit (event) {
      var data = new window.FormData(this)
      var button = this.querySelector('.js-button')

      var body = {}
      data.forEach(function (value, key) {
        body[key] = value
      })

      window.fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (!res.ok) return res.text().then((text) => Promise.reject(text))
        self.local.subscribed = true
        self.rerender()
      }).catch(() => {
        var url = new window.URL(props.action)
        Object.keys(data).forEach(function (key) {
          url.searchParams.set(key, data[key])
        })
        window.location = url.toString()
      })

      button.disabled = true
      event.preventDefault()
    }
  }
}
