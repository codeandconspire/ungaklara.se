var html = require('choo/html')

module.exports = jigsaw

function jigsaw (heading, body, image, gallery, alt) {
  return html`
    <div class="Jigsaw ${alt ? 'Jigsaw--alt' : null}">
      <div class="u-container">
        <div class="Jigsaw-heading">${heading}</div>
        <div class="Jigsaw-body">${body}</div>
        <div class="Jigsaw-figure">
          <div class="Jigsaw-image">${image}</div>
        </div>
      </div>
    </div>
  `
}
