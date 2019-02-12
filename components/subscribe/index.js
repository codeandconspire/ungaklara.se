var html = require('choo/html')
var Component = require('choo/component')
var button = require('../button')
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
        <div class="Text u-textCenter">
          ${props.title ? html`<h2>${props.title}</h2>` : null}
          ${this.local.subscribed ? html`
            <div>
              ${props.success || html`<p>${text`Thanks for signing up!`}</p>`}
              <br>
              ${button({ href: props.action, text: text`Sign up another e-mail address`, onclick: onreset })}
            </div>
          ` : props.body}
        </div>
        ${!this.local.subscribed ? html`
          <fieldset class="Subscribe-fieldset js-fieldset">
            ${props.ref ? html`<input type="hidden" name="REF" value="${props.ref}">` : null}
            <div class="Subscribe-form">
              <label class="Subscribe-label">
                <span class="u-hiddenVisually">${text`Enter your e-mail address`}</span>
                <input type="email" name="EMAIL" class="Subscribe-input" autocomplete="email" placeholder="${text`Enter your e-mail address`}" required>
              </label>
              <button type="submit" class="Subscribe-button">
                ${text`Subscribe`}
              </button>
            </div>
          </fieldset>
        ` : null}
      </form>
    `

    function onreset () {
      self.local.subscribed = false
      self.rerender()
    }

    function onsubmit (event) {
      var data = new window.FormData(this)
      var fieldset = this.querySelector('.js-fieldset')

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

      fieldset.disabled = true
      event.preventDefault()
    }
  }
}
