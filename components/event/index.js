var html = require('choo/html')
var asElement = require('prismic-element')
var { Elements } = require('prismic-richtext')
var button = require('../button')
var framed = require('../framed')
var { resolve } = require('../base')
var serialize = require('../text/serialize')

module.exports = event

// orchestrate layout of common components
// obj -> Element
function event (props) {
  var body = props.body.slice()
  var image = Object.assign({ type: Elements.image }, props.image)

  for (let i = body.length - 1; i >= 0; i--) {
    if (body[i].type === Elements.paragraph) {
      body.splice(i, 0, image)
      break
    }
  }

  return html`
    <article class="Event">
      <div class="Event-body">
        <div class="Text Text--large">${asElement(body, resolve, middleman)}</div>
        ${props.actions ? html`
        <div class="Event-actions">
          ${props.actions.map((attrs) => html`
            <span class="Event-action">
              ${button(Object.assign({ class: 'u-block' }, attrs))}
            </span>
          `)}
        </div>
      ` : null}
      </div>
      <div class="Event-image Event-image--outside">
        ${framed(Object.assign({ src: image.url }, image.dimensions))}
      </div>
    </article>
  `
}

function middleman (type, node, content, children) {
  if (type === Elements.image) {
    return html`
      <div class="Event-image Event-image--inside">
        ${framed(Object.assign({ src: node.url }, node.dimensions))}
      </div>
    `
  }
  return serialize(type, node, content, children)
}
