var assert = require('assert')
var html = require('choo/html')
var link = require('./link')
var figure = require('./figure')
var { luma, hexToRgb, className, snippet, loader } = require('../base')

module.exports = card
card.loading = loading

function card (props = {}, slot) {
  var fill = props.color || null
  assert(!fill || /^#/.test(fill), 'Card: props.color should be hex string color code')

  var body = props.body
  if (body) {
    if (typeof window === 'undefined') {
      if (Array.isArray(body) || body[0] === '<') html`<div class="Card-text Text">${body}</div>`
      else body = html`<p class="Card-text">${snippet(body, props.truncate || 170)}</p>`
    } else if (typeof body === 'string') {
      body = html`<p class="Card-text">${snippet(body, props.truncate || 170)}</p>`
    } else {
      body = html`<div class="Card-text Text">${body}</div>`
    }
  }

  if (typeof props.link === 'string') props.link = { href: props.link }

  var attrs = {
    class: className('Card', {
      'Card--shrink': props.shrink,
      'Card--interactive': props.link && (fill || props.background),
      'Card--dark': props.background || (fill && luma(fill) < 110),
      'Card--fill': fill || props.background,
      'Card--background': props.background
    })
  }
  if (fill) attrs.style = `--Card-background-color: ${hexToRgb(fill)};`
  if (props.image && props.image.width && props.image.height) {
    if (!attrs.style) attrs.style = ''
    attrs.style += ` --Card-figure-aspect: ${100 * props.image.height / props.image.width}%;`
  }

  var cover = null
  if (slot) {
    cover = typeof slot === 'function' ? slot() : slot
  } else if (props.image) {
    cover = figure(Object.assign({ background: props.background }, props.image))
  }

  var date = props.date
  if (typeof date === 'string') date = new Date(props.date)
  if (date instanceof Date) {
    date = {
      datetime: date,
      text: typeof props.date === 'string' ? props.date : date.toLocaleString()
    }
  }

  return html`
    <article ${attrs}>
      ${cover}
      <div class="Card-content ${fill ? 'u-hoverTriggerTarget u-paddedBox' : ''}" style="--Card-figure-aspect: 142.8%">
        <div class="Card-body">
          ${date && date.text && date.datetime ? html`
            <time class="Card-meta" datetime="${JSON.stringify(date.datetime).replace(/"/g, '')}">
              ${date.text}
            </time>
          ` : null}
          <h3 class="Card-title">${props.title}</h3>
          ${body}
        </div>
        ${props.link ? html`
          <div class="Card-footer">
            ${link(props.link)}
          </div>
        ` : null}
      </div>
    </article>
  `
}

function loading (opts = {}) {
  return html`
    <article class="Card ${opts.shrink ? 'Card--shrink' : ''} is-loading">
      ${figure.loading()}
      <div class="Card-content">
        <div class="Card-body">
          ${opts.date ? html`
            <time class="Card-meta">${loader(8)}</time>
          ` : null}
          <h3 class="Card-title">${loader(8)}</h3>
          <p class="Card-text">${loader(24)}</p>
        </div>
      </div>
    </article>
  `
}
