<script>
  import Button from './Button.svelte'
  import Framed from './Framed.svelte'
  import srcset from './utils/srcset'
  import Html from './Html.svelte'

  export let teaser = false
  export let image = null

  /** @type {string?} */
  export let label = null

  /** @type {{ [key: string]: any, text: string }[]}*/
  export let buttons = []

  let imageAttrs = null
  $: if (image.url) {
    const sources = srcset(image.url, [400, 600, [900, 'q_50']])
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
    <Html size="large">
      <slot />
    </Html>
    {#if buttons.length}
      <div class="actions">
        {#each buttons as { text, ...attrs }}
          <span class="action">
            <Button {...attrs} on:click={attrs.onclick}>{text}</Button>
          </span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="image outside"><Framed size="flexible" {...imageAttrs} /></div>
</div>

<style>
  .event {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;
  }

  .teaser {
    margin-top: 2.3rem;
  }

  .body {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 600px) {
    .event {
      flex-direction: row;
      padding-top: 1rem;
      flex-wrap: wrap;
    }

    .body {
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

  .event:not(.teaser) .inside {
    display: block;
    float: right;
    max-width: 41%;
    margin: 0 0 0.5rem 1rem;
  }

  @media (min-width: 600px) {
    .event:not(.teaser) .inside {
      display: none;
    }

    .teaser .image {
      margin-bottom: 0;
    }

    .teaser .image,
    .event:not(.teaser) .outside {
      display: block;
      order: -1;
      flex-basis: 30%;
      padding-right: 2rem;
      position: relative;
      top: -1rem;
    }

    .teaser .image {
      margin-bottom: -2rem;
    }
  }

  @media (min-width: 800px) {
    .teaser .image,
    .event:not(.teaser) .outside {
      padding-right: 3rem;
    }
  }

  @media (min-width: 1000px) {
    .teaser .image,
    .event:not(.teaser) .outside {
      flex-basis: 32%;
      padding-right: 6rem;
    }

    .teaser .image {
      max-width: 21rem;
    }
  }

  .actions {
    display: flex;
    flex-wrap: nowrap;
    margin: 1rem 0;
  }

  .event:not(.teaser) .actions {
    margin: 0 0 2.5rem;
    order: -1;
  }

  .event:not(.teaser) .action {
    flex: 1 1 auto;
  }

  .event:not(.teaser) .action:not(:last-child) {
    margin-right: 1em;
  }

  @media (min-width: 600px) {
    .teaser .actions {
      margin-bottom: 0;
    }

    .event:not(.teaser) .actions {
      order: 2;
      margin: 2rem 0 1rem;
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
