var html = require('choo/html')

module.exports = jigsaw

function jigsaw (heading, body, image, gallery) {
  return html`
    <div class="Jigsaw">
      <div class="Jigsaw-heading">${heading}</div>
      <div class="Jigsaw-body">${body}</div>
      <div class="Jigsaw-image">${image}</div>
    </div>
  `
}
