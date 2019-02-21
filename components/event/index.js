var html = require('choo/html')
var Component = require('choo/component')
var asElement = require('prismic-element')
var { Elements } = require('prismic-richtext')
var button = require('../button')
var framed = require('../framed')
var serialize = require('../text/serialize')
var { resolve, srcset } = require('../base')

module.exports = class Event extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  static render (props) {
    return render(props)
  }

  createElement (props) {
    return render(Object.assign({ id: this.local.id }, props))
  }
}

// orchestrate layout of common components
// obj -> Element
function render (props) {
  var sources = srcset(props.image.url, [400, 600, [900, 'q_50']])
  var image = Object.assign({
    srcset: sources,
    sizes: '(min-width: 600px) 25vw, 50vw',
    size: 'flexible',
    alt: props.image.alt || '',
    src: sources.split(' ')[0]
  }, props.image.dimensions)

  var body = props.body
  if (!props.teaser) {
    body = body.slice()
    for (let i = body.length - 1; i >= 0; i--) {
      if (body[i].type === Elements.paragraph) {
        body.splice(i, 0, Object.assign({ type: Elements.image }, props.image))
        break
      }
    }
    body = asElement(body, resolve, middleman)
  }

  var attrs = { class: 'Event' }
  if (props.teaser) attrs.class += ' Event--teaser'
  if (props.id) attrs.id = props.id

  return html`
    <div ${attrs}>
      <div class="Event-body">
        ${props.label ? html`
          <span class="u-textLabel">
            ${props.label}
          </span>
        ` : null}
        <div class="Text Text--large">${body}</div>
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
        ${framed(image)}
      </div>
    </div>
  `

  function middleman (type, node, content, children) {
    if (type === Elements.image) {
      return html`<div class="Event-image Event-image--inside">
          ${framed(image)}
        </div>
      `
    }
    return serialize(type, node, content, children)
  }
}
