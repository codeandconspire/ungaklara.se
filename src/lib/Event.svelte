<script>
  import { srcset } from './utils/srcset.js'
  import Button from './Button.svelte'
  import Framed from './Framed.svelte'
  import Html from './Html.svelte'

  export let teaser = false
  export let image = null

  /** @type {string?} */
  export let label = null

  /** @type {{ [key: string]: any, text: string }[]}*/
  export let buttons = []

  let imageAttrs = null
  $: if (image.url) {
    const sources = srcset(image.url, [400, 600, [900, 'q_80']])
    imageAttrs = {
      srcset: sources,
      alt: image.alt || '',
      sizes: '(min-width: 600px) 25vw, 50vw',
      src: sources.split(' ')[0],
      ...image.dimensions
    }
  }
</script>

<div class="event" class:teaser>
  <div class="body">
    {#if label}
      <span class="u-textLabel">{label}</span>
    {/if}
    <Html size="large" class={label ? 'u-nudgeMd' : ''}>
      <slot />
    </Html>
    {#if buttons?.length}
      <div class="actions">
        {#each buttons as { text, onclick, ...attrs }}
          <span class="action">
            <Button {...attrs} on:click={onclick}>{text}</Button>
          </span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="image"><Framed size="flexible" {...imageAttrs} /></div>
</div>

<style>
  .event {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;
    margin-top: 2.5rem;
  }

  .teaser {
    margin-top: 0;
  }

  .body {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 600px) {
    .event {
      flex-direction: row;
      flex-wrap: wrap;
      margin-top: 5rem;
    }

    .teaser {
      margin-top: 0;
    }

    .teaser .body {
      flex-basis: 70%;
    }
  }

  @media (min-width: 1000px) {
    .body {
      flex-basis: 68%;
    }
  }

  .image {
    position: relative;
    z-index: -1;
  }

  .teaser .image {
    margin-bottom: 2rem;
    max-width: 14rem;
    order: -1;
  }

  .event:not(.teaser) .image {
    display: none;
  }

  @media (min-width: 600px) {
    .teaser .image {
      margin-bottom: 0;
    }

    .teaser .image {
      display: block;
      order: -1;
      flex-basis: 30%;
      padding-right: 2rem;
      position: relative;
    }

    .teaser .image {
      margin-bottom: -2rem;
    }
  }

  @media (min-width: 800px) {
    .teaser .image {
      padding-right: 3rem;
    }

    .event:not(.teaser) {
      flex-wrap: nowrap;
      gap: 4rem;
    }

    .event:not(.teaser) .image {
      display: block;
      order: -1;
      flex-basis: auto;
      max-width: 25rem;
    }
  }

  @media (min-width: 1000px) {
    .teaser .image {
      flex-basis: 32%;
      padding-right: 6rem;
    }

    .event:not(.teaser) {
      flex-wrap: nowrap;
      gap: 6rem;
    }

    .teaser .image {
      max-width: 21rem;
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: var(--space-sm) 0 0;
  }

  .event:not(.teaser) .actions {
    margin: 0 0 2.5rem;
    order: -1;
    gap: 0.75rem;
  }

  @media (min-width: 600px) {
    .teaser .actions {
      margin-bottom: 0;
    }

    .event:not(.teaser) .actions {
      order: 2;
      margin: 2rem 0 1rem;
      gap: 1.25rem;
    }

    .event:not(.teaser) .action {
      flex: 0 1 auto;
    }
  }

  @media (min-width: 1000px) {
    .event:not(.teaser) .actions {
      margin-bottom: 2rem;
    }
  }
</style>
