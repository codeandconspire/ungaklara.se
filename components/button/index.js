var html = require('choo/html')
var { className } = require('../base')

var ATTRS = [ 'disabled', 'type', 'title', 'aria-', 'on', 'autofocus',
  'formnovalidate', 'download' ]

module.exports = button

function button (props) {
  var attrs = {}
  if (props.href) {
    attrs = { href: props.href }
  }

  var keys = Object.keys(props).filter(isAttribute)
  for (let i = 0, len = keys.length; i < len; i++) {
    if (props[keys[i]]) attrs[keys[i]] = props[keys[i]]
  }
  attrs.class = className('Button', {
    [props.class]: props.class,
    'Button--primary': props.primary,
    'Button--cover': props.cover
  })
  if (attrs.href) return html`<a ${attrs}>${props.text}</a>`
  return html`<button ${attrs}>${props.text}</button>`
}

// check if str is applicable element attribute
function isAttribute (str) {
  return !!ATTRS.find((value) => str.indexOf(value) === 0)
}
