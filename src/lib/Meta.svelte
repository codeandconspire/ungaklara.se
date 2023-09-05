<script>
  import { afterNavigate } from '$app/navigation'
  import { asText } from '@prismicio/helpers'
  import { writable } from 'svelte/store'
  import { page } from '$app/stores'

  import { hexToRgb, luma } from '$lib/utils/colors'

  let DEFAULT_THEME = '#9cfc23'
  let FAVICON_TEMPLATE =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAspJREFUWAntlcuLj1EYx2fcRm65lFxKuRYLFsLOpVlYKCu5bJhJQpbslUvERKKwsBixkBVZCIWsiNiQmTBuuWRcQ7n7fF7vU493Zv4Bft/6/M7znOe85z3nec57fnV1NdUyUMvA/56B+jIBg2iHpWS8xP6afM3R0Kfs+0z7urSjGYvRq3R81jm603A6B5aB5zFgPcavxBbsIREs27cp/gF7coovTTHnOZJiYTZgbAUX9w4OQRMU2sRvXsBR/NY/oeK3fyXu2JvgpO78DcTz17Alax5OGzjmAhyD77AzUjoRp6oVdJgZ0z2qDG6nHVnaNtNgDuTyteMvAzUUdsNqcNeHYT40QiEX4OSegaou0+HLlfVXvnxNYf35MVNVxblaSmAfOP958Mz4bC8IderkWkbA9lRyXIC1M+VZ97OTbDd2AvqCtR4PyyFe/h67CVoc6AKsTVWnU4e7eALjUp/ZeZH8qnmWDg/rWoisOOYcWJKnOrEA7axbOI9Thxl4BBNSXwd2dwt3d+56Ibjz0EeM43ARipcbiAV80km6mmxNM+BDc3VKPQij0i7GHwN519fxb0AzrIAr8AyKmkyire7kp8Gk2dh+Ni441FP9/Szzyx2vb/b6gfeLh7OQh2IEeFiyZuEsAGu+EaZDddKeMsDQYkMnaX/ooJnwEOL2XIK9CApd4tfamIXgQLKj72ClrxFfrYMYY3sPdoHaARH7ht2S/A7sAVBcGtUX+gnuB8+CN54puw0xmddyZK26AK9hP1nVAHcgnruL7dcV/jZL4Pfq5F4WIQ/SSrDmvWEDeOuFWjHcUXfy2u4sA19omyFK0Y49tYzZletbhcyARxCr66k9w5jYPWaXEljOVQaSLInz7S1bba/mwfCXrMlm8IJxUMYsuZv8ctwuC/D5egNJZmUPtEHM6XnoMtC+kH8kU8A0doC3Wk21DNQy8O9l4Dev1sS8/Az7hwAAAABJRU5ErkJggg=='

  const props = writable(define($page.data.page, $page.data.settings))

  afterNavigate(function () {
    props.set(define($page.data.page, $page.data.settings))
    let favicon = new window.Image()
    favicon.src = FAVICON_TEMPLATE
    let link = document.head.querySelector('link[rel="icon"]')
    try {
      if (link) {
        link.setAttribute(
          'href',
          drawFavicon(favicon, defineTheme($page.data.page)) || ''
        )
      }
    } catch (err) {}
  })

  function define(doc, settings) {
    return {
      title: asText(doc.data.shortname) || asText(doc.data.title) || '',
      desc: asText(doc.data.description) || '',
      image: getImage(doc) || getImage(settings),
      theme: getTheme(doc)
    }
  }

  function getTheme(doc) {
    return doc.data.theme || DEFAULT_THEME
  }

  function getImage(doc) {
    return doc.data.featured_image?.url ? doc.data.featured_image : null
  }

  function drawFavicon(image, color) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 32
    canvas.height = 32
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'source-in'
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return canvas.toDataURL()
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
  <meta name="theme-color" content={$props.theme} />
  {@html `<style>
    :root { --theme-color: ${hexToRgb($props.theme)} !important }
    ${
      luma($props.theme) < 110
        ? ':root { --theme-color-is-dark: 255, 255, 255 !important }'
        : ''
    }
  </style>`}
{/if}
