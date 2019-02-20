var html = require('choo/html')
var { className } = require('../base')

var ATTRS = [ 'disabled', 'type', 'title', 'aria-', 'on', 'autofocus',
  'formnovalidate', 'download' ]

module.exports = button

function button (props) {
  var attrs = {}
  if (props.href) {
    attrs = { href: props.href }
    if (props.external) {
      attrs.rel = 'noopener noreferrer'
      attrs.target = '_blank'
    }
  }

  var keys = Object.keys(props).filter(isAttribute)
  for (let i = 0, len = keys.length; i < len; i++) {
    if (props[keys[i]]) attrs[keys[i]] = props[keys[i]]
  }
  attrs.class = className('Button', {
    [props.class]: props.class,
    'Button--primary': props.primary,
    'Button--secondary': props.secondary,
    'Button--cover': props.cover
  })

  var children = [props.text]
  if (props.icon) {
    children.unshift(html`<span class="Button-icon">${props.icon}</span>`)
  }

  if (attrs.href) return html`<a ${attrs}>${children}</a>`
  return html`<button ${attrs}>${children}</button>`
}

// check if str is applicable element attribute
function isAttribute (str) {
  return !!ATTRS.find((value) => str.indexOf(value) === 0)
}
