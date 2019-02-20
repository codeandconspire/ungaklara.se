var html = require('choo/html')
var { Elements } = require('prismic-richtext')
var symbol = require('../symbol')
var serialize = require('./serialize')

module.exports = checklist

// render list as checklists
// (str, obj, any, arr) -> Element
function checklist (type, node, content, children) {
  switch (type) {
    case Elements.listItem:
    case Elements.oListItem: return html`<li><span class="Text-icon">${symbol.checkcircle()}</span> ${children}</li>`
    case Elements.list: return html`<ul class="Text-checklist">${children}</ul>`
    case Elements.oList: return html`<ol class="Text-checklist">${children}</ol>`
    default: return serialize(type, node, content, children)
  }
}
