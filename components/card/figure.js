var html = require('choo/html')
var assert = require('assert')
var { pluck, className } = require('../base')

module.exports = figure
figure.loading = loading

function figure (props = {}) {
  assert(props.src, 'figure: src string is required')
  var src = props.src
  var attrs = pluck(props, 'width', 'height', 'srcset', 'sizes', 'alt')
  attrs.alt = attrs.alt || ''

  return html`
    <figure class="${className('Card-figure u-hoverTriggerTarget', { 'Card-figure--background': props.background })}">
      <img class="Card-image" ${attrs} src="${src}" />
      ${props.caption ? caption(props.caption) : null}
    </figure>
  `
}

function caption (content) {
  html`
    <figcaption class="Card-caption">
      <p>${content}</p>
    </figcaption>
  `
}

function loading (props = {}) {
  return html`<div class="Card-figure is-loading"></div>`
}
