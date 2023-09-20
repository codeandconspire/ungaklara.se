<script>
  import { asHTML, asLink, Element } from '@prismicio/helpers'
  import { resolve } from '$lib/prismic.js'

  /** @type {[]|[import('@prismicio/types').RTNode, ...import('@prismicio/types').RTNode[]]}*/
  export let content = []

  $: html = asHTML(content, resolve, serialize)
  $: isEmpty = !html || html === '<p></p>'

  function serialize(type, element, content, children) {
    switch (type) {
      case Element.heading1:
        return `<h1>${children}</h1>`
      case Element.heading2:
        return `<h2>${children}</h2>`
      case Element.heading3:
        return `<h3>${children}</h3>`
      case Element.heading4:
        return `<h4>${children}</h4>`
      case Element.heading5:
        return `<h5>${children}</h5>`
      case Element.heading6:
        return `<h6>${children}</h6>`
      case Element.paragraph:
        return `<p>${children}</p>`
      case Element.preformatted:
        return `<pre>${children}</pre>`
      case Element.strong:
        return `<strong>${children}</strong>`
      case Element.em:
        return `<em>${children}</em>`
      case Element.listItem:
      case Element.oListItem:
        return `<li>${children}</li>`
      case Element.list:
        return `<ul>${children}</ul>`
      case Element.oList:
        return `<ol>${children}</ol>`
      case Element.image:
        return `
          <img
            class="image"
            src="${element.url}"
            alt="${element.alt || ''}"
            width="${element.dimensions.width}"
            height="${element.dimensions.height}" />
        `
      case Element.embed:
        return element.oembed.html
      case Element.hyperlink: {
        const props = { href: asLink(element.data, resolve) }
        if (element.data.target && element.data.target === '_blank') {
          props.target = '_blank'
          props.rel = 'noopener noreferrer'
        }
        return `<a ${Object.entries(props)
          .map((pair) => pair.join('='))
          .join(' ')}>${children}</a>`
      }
      case Element.label:
        return `<span>${children}</span>`
      case Element.span: {
        let str = content.toString()

        if (typeof window === 'undefined') {
          str = str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
        }

        return str.replace(/\n/g, '<br />')
      }
      default:
        return null
    }
  }
</script>

{#if isEmpty}
  <slot />
{:else}
  {@html html}
{/if}
