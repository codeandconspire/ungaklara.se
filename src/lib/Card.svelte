<script>
  import { hexToRgb, luma } from './utils/colors.js'
  import Symbol from '$lib/Symbol.svelte'

  export let background = null
  export let shrink = false
  export let caption = null
  export let color = null
  export let date = null

  /** @type {null|({ [key: string]: string } & { src: string, alt?: string })} */
  export let image = null

  /** @type {null|'small'} */
  export let size = null

  /** @type {boolean|number} */
  export let clamp = false

  /** @type {string|void|null}*/
  export let title = null

  /** @type {{ href: string, text?: string }?}*/
  export let link = null

  $: internal = link?.href?.match(/^\/[^/]/)
  $: filetype = link?.href?.match(/\.(\w+)(?:\?|$)/)
</script>

<article
  class="card"
  class:shrink
  class:simple={filetype}
  class:small={size === 'small'}
  class:fill={color || background}
  class:interactive={link && (color || background)}
  class:dark={background || (color && luma(color) < 110)}
  style:--background-color={color && hexToRgb(color)}
  style:--figure-aspect={image && image.height && image.width
    ? `${(100 * +image.height) / +image.width}%`
    : null}>
  <div class="everything">
    {#if image}
      <figure class="figure u-hoverTriggerTarget">
        <img class="image" alt="" {...image} />
        {#if caption}
          <figcaption class="caption">
            <p>{caption}</p>
          </figcaption>
        {/if}
      </figure>
    {/if}
    <div
      class="content"
      class:u-paddedBox={color && size !== 'small'}
      class:u-hoverTriggerTarget={color}>
      <div class="body">
        {#if date}
          <time class="meta" datetime={date.toJSON()}>
            {date.toLocaleString('sv', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        {/if}
        {#if title}<h3 class="title">{title}</h3>{/if}
        <div
          class="text"
          class:clamp
          style:--clamp-lines={typeof clamp === 'number' ? clamp : null}>
          <slot />
        </div>
      </div>

      {#if link}
        {@const filename = filetype ? link.href.split('/').pop() : null}
        <div class="footer">
          <a
            on:click
            class="link"
            class:simle={filetype}
            href={link.href}
            download={filename}
            target={internal ? null : '_blank'}
            rel={internal ? null : 'noopener noreferrer'}>
            {#if filetype}
              <span class="icon">
                <Symbol name="download" />
              </span>
            {/if}

            {#if link.text}
              {link.text}
            {:else if filetype}
              Ladda ner
            {:else if !internal}
              Läs mer
            {:else}
              Läs mer
            {/if}
          </a>
        </div>
      {/if}
    </div>
  </div>
</article>

<style>
  :root {
    --figure-aspect: 67%;
    --clamp-lines: 3;
  }

  .card {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    position: relative;
    z-index: 0;
    color: rgb(var(--current-color));
  }

  .everything {
    position: relative;
    z-index: 1;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .interactive.fill .everything {
    transition: transform 150ms 20ms var(--ease-out);
  }

  .interactive.fill:hover .everything {
    transform: translateY(-0.6rem);
  }

  .interactive.fill::before {
    content: '';
    display: block;
    width: 94%;
    height: 100%;
    position: absolute;
    left: 3%;
    bottom: 0;
    z-index: -1;
    background: black;
    border-radius: var(--border-radius);
  }

  @media print {
    .card {
      page-break-inside: avoid;
      page-break-after: avoid;
    }
  }

  .content {
    --figure-aspect: 142.8%;

    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    padding-bottom: 1.25rem;
    align-items: flex-start;
  }

  .content:not(:first-child) {
    padding-top: 1.2rem;
  }

  @media (min-width: 800px) {
    .content:not(:first-child) {
      padding-top: 1.5rem;
    }
  }

  .small .content {
    padding: 1rem 1rem 1.5rem;
  }

  /**
 * 1. Get a z-index to put ontop of hover shading
 */

  .body {
    flex-grow: 1;
    position: relative; /* 1 */
    width: 100%;
  }

  .card:not(.fill) .body {
    flex-grow: 0;
  }

  .meta {
    display: block;
    margin: 0.75rem 0 0.6rem;
    color: rgb(var(--color-text-muted));
    font-size: 0.875rem;
    font-style: normal;
  }

  .title {
    text-wrap: balance;
    font-size: 1.25rem;
    font-weight: 600;
    font-family: var(--heading-font-family);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    line-height: var(--heading-line-height);
    text-underline-offset: 0.25em;
    text-decoration-thickness: var(--border-width);
  }

  @media (min-width: 800px) {
    .card:not(.small) .title {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 599px) {
    .shrink:not(.is-loading) .title {
      text-decoration: underline;
    }
  }

  .text {
    font-size: 1rem;
    margin-top: 0.5rem;
    font-size: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text:first-child {
    margin-top: -0.5rem;
  }

  @media (max-width: 599px) {
    .shrink .text {
      font-size: 0;
      opacity: 0;
      height: 0;
      margin: 0;
    }
  }

  .clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--clamp-lines);
    overflow: hidden;
  }

  .footer {
    --current-background: 0, 0, 0;
    flex-grow: 0;
    width: 100%;
    margin-top: 1rem;
  }

  .fill.dark {
    --current-color: 255, 255, 255;
  }

  .fill:not(.dark) {
    --current-color: var(0, 0, 0);
  }

  .dark .footer {
    --current-background: 255, 255, 255;
  }

  .fill .everything {
    background-color: rgb(var(--background-color, var(--current-background)));
    border-radius: var(--border-radius);
  }

  /**
 * Figure
 */

  .figure {
    margin: 0;
    position: relative;
    overflow: hidden;
    z-index: -1;
  }

  .figure::before {
    content: '';
    display: block;
    height: 0;
    padding-top: var(--figure-aspect);
  }

  .fill .figure::before {
    padding-top: 68%;
  }

  .card:not(.simple):not(.fill) .figure::after {
    content: '';
    width: 100%;
    height: 100%;
    border: 2px solid black;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .card:not(.simple):not(.fill):hover .figure::after {
    z-index: 1;
  }

  .caption {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  .image {
    position: absolute;
    left: 50%;
    top: 50%;
    min-width: 100%;
    min-height: 100%;
    max-height: 100%;
    width: auto;
    transform: translate(-50%, -50%);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  .card.simple .image {
    border-radius: var(--border-radius);
  }

  @supports (object-fit: cover) {
    .image {
      object-fit: cover;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      transform: none;
    }
  }

  /**
 * Link
 */

  .link {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: underline;
    text-underline-offset: 0.25em;
    text-decoration-thickness: var(--border-width);
    font-size: 1rem;
    font-family: var(--heading-font-family);
    font-weight: 600;
    white-space: nowrap;
    user-select: none;
  }

  .link:not(.link--simple)::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .card:not(.fill) .link:hover {
    background: black;
    color: #fff;
    border-radius: var(--border-radius);
    text-decoration: none;
    padding: 0.2rem;
    margin: -0.2rem 0 -0.2rem -0.2rem;
  }

  @media print {
    .link {
      display: none !important;
    }
  }

  .icon {
    padding-right: 0.2em;
    line-height: 0;
    margin: -0.1rem 0;
  }

  @media (max-width: 599px) {
    .shrink .link {
      font-size: 0;
      opacity: 0;
      height: 0;
    }

    .shrink .footer {
      margin: 0;
      padding: 0;
      height: 0;
    }
  }
</style>
