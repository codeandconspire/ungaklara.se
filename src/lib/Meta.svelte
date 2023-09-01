<script>
  import { asText } from '@prismicio/helpers'
  import { hexToRgb, luma } from '$lib/utils/colors';
  import { writable } from 'svelte/store'
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';


  let props = writable(define($page.data.page, $page.data.settings))

  afterNavigate(function () {
    props.set(define($page.data.page, $page.data.settings))
  })

  function define(doc, settings) {
    let title = getTitle(doc)
    let desc = asText(doc.data.description)
    if (!desc) desc = ''

    let image = getImage(doc)
    if (settings && !image) image = getImage(settings)

    let theme = doc.data.theme && hexToRgb(doc.data.theme)
    if (!theme) theme = '156, 252, 35'

    return { title, desc, image, theme }
  }

  function getTitle(doc) {
    if (doc.data.shortname) return asText(doc.data.shortname)
    if (doc.data.title) return asText(doc.data.title)
    return ''
  }

  function getImage(doc) {
    if (doc.data.featured_image?.url) return doc.data.featured_image
    return null
  }
</script>

<title>{$props.title}</title>
<meta property="og:title" content={$props.title} />
<meta name="description" content={$props.desc} />
{#if $props.image}
  <meta property="og:image" content={$props.image.url} />
  <meta property="og:image:width" content={$props.image.dimensions.width} />
  <meta property="og:image:height" content={$props.image.dimensions.height} />
{/if}
{#if $props.theme}
  {@html `<style class="theme">
    :root { --theme-color: ${$props.theme} }
    ${luma($props.theme) < 110 ? ':root { --theme-color-is-dark: 255, 255, 255 }' : ''}
  </style>`}
{/if}
