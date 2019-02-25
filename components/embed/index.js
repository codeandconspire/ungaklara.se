var assert = require('assert')
var html = require('choo/html')
var player = require('./player')
var { pluck, i18n } = require('../base')

var text = i18n()

// match short and long youtube links
// https://www.youtube.com/watch?foo=bar&v=WwE7TxtoyqM&bin=baz
// https://youtu.be/gd6_ZECm58g
var YOUTUBE_RE = /https?:\/\/(?:www.)?youtu\.?be(?:\.com\/watch\?(?:.*?)v=|\/)(.+?)(?:&|$)/

module.exports = embed
module.exports.id = id

function embed (props) {
  assert(props.src, 'figure: src string is required')
  var src = props.src
  var attrs = pluck(props, 'width', 'height', 'srcset', 'sizes', 'alt')
  attrs.alt = attrs.alt || props.title || ''

  return html`
    <figure class="Embed ${props.size ? `Embed--${props.size}` : ''}">
      <a class="Embed-link" href="${props.url}" target="_blank" rel="noopener noreferrer" onclick=${onclick}>
        <span class="u-hiddenVisually">${text`Play ${props.title || ''}`}</span>
      </a>
      <img class="Embed-image" ${attrs} src="${src}">
      <figcaption class="Embed-caption">
        ${props.title ? html`<strong class="Embed-title">${props.title}</strong>` : null}
        ${props.description ? html`<p class="u-spaceT1"><span class="Embed-description">${props.description}</span></p>` : null}
      </figcaption>
    </figure>
  `

  function onclick (event) {
    if (typeof props.onplay === 'function') props.onplay()
    player.render(props.url, props.onstop)
    event.preventDefault()
  }
}

// extract unique embed id
// obj -> str
function id (props) {
  switch (props.provider_name) {
    case 'YouTube': return props.embed_url.match(YOUTUBE_RE)[1]
    case 'Vimeo': return props.embed_url.match(/vimeo\.com\/(.+)?\??/)[1]
    default: return null
  }
}
