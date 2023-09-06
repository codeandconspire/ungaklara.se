<script>
  export let title = undefined
  export let collapse = false
  export let adapt = false
  export let blurb = false
  export let image = null
</script>

<div class="intro" class:collapse class:adapt class:blurb>
  <div class="slot">
    <slot />
  </div>
  {#if $$slots.action && blurb}
    <div class="u-container u-invisible"><hr /></div>
  {/if}
  <div class="title">
    {#if $$slots.badge}
      <span class="badge">
        <span class="u-textLabel"><slot name="badge" /></span>
      </span>
    {/if}
    {title}
  </div>
  {#if $$slots.text}
    <div class="text"><slot name="text" /></div>
  {/if}
  {#if image}
    {#if image.width && image.height}
      <div class="container" style:--aspect={image.height / image.width}>
        <img class="image" alt={image.alt} {...image} />
      </div>
    {:else}
      <img class="image" alt={image.alt} {...image} />
    {/if}
  {/if}
  {#if $$slots.action && blurb}
    <div class="action"><slot name="action" /></div>
  {/if}
</div>

<style>
  :root {
    --spacing: 3rem;
    --aspect: 0.5625;
  }

  .intro {
    display: flex;
    flex-direction: column;
    padding-top: 25vh;
    margin-bottom: calc(var(--spacing) * 1);
    font-family: var(--heading-font-family);
    letter-spacing: -0.025em;
    line-height: 1.3;
    position: relative;
    overflow: hidden;
  }

  .collapse {
    --spacing: 2rem;
  }

  .adapt {
    margin-bottom: 1rem;
  }

  .blurb {
    margin-bottom: 0 !important;
    padding-top: 0 !important;
    text-align: center;
  }

  .blurb .title {
    padding-top: 0;
  }

  .slot {
    position: absolute;
    top: 10vh;
    right: 14vw;
  }

  @media (min-width: 600px) {
    .slot {
      top: 19vh;
      right: 20vw;
    }
  }

  .action {
    margin-top: 1.6rem;
  }

  .title {
    position: relative;
    font-size: 2.1rem;
    word-spacing: -0.05em;
    padding-top: 0.75em;
    margin: 0 0 0.55em;
    hyphens: auto;
    line-height: 1;
    margin-left: -0.04em;
    letter-spacing: -0.025em;
  }

  .badge {
    position: relative;
    left: 0.04em;
    line-height: 1.4;
    margin: -2rem 0 0.9rem;
    display: block;
    word-spacing: 0;
  }

  .badge:empty {
    display: none;
  }

  .text {
    max-width: 34em;
  }

  .text :global(a) {
    border-bottom: 2px solid;
  }

  .text :global(a) {
    display: inline-block;
    border-bottom: 2px solid currentColor;
  }

  .text :global(p:not(:first-child)),
  .text :global(ul:not(:first-child)),
  .text :global(ol:not(:first-child)) {
    margin-top: 1em;
  }

  /**
 * Lists
 */

  .text :global(ul) {
    list-style-type: none;
  }

  .text :global(ol) {
    list-style-type: decimal;
    padding-left: 1.5em;
  }

  .text :global(ul > li) {
    padding-left: 1.5em;
    position: relative;
  }

  .text :global(ol > li) {
    padding-left: 0.5em;
  }

  .text :global(ul > li::before) {
    content: '–';
    position: absolute;
    left: 0;
    font-weight: 600;
    color: var(--color-theme);
  }

  .text :global(li + li) {
    margin-top: 0.8em;
  }

  .image {
    background: rgba(0, 0, 0, 0.05);
    display: block;
    width: 100%;
    height: auto;
    margin: -24vh 0 2rem;
    order: -1;
  }

  .container {
    margin: -12vh 0 2rem;
    order: -1;
    position: relative;
    overflow: hidden;
  }

  .container::before {
    content: '';
    display: block;
    height: 0;
    padding-top: calc(100% * var(--aspect));
  }

  @media (min-width: 350px) {
    .title {
      font-size: 2.5rem;
    }

    .text {
      font-size: 1.3rem;
    }
  }

  @media (min-width: 500px) {
    .title {
      font-size: 3.2rem;
      margin: 0 0 0.45em;
    }

    .text {
      font-size: 1.35rem;
    }

    .badge {
      margin: -2.4rem 0 1.3rem;
    }
  }

  @media (min-width: 600px) {
    .Intro:not(.adapt) {
      margin-bottom: 3rem;
    }

    .image,
    .container {
      margin: 3rem 0 0;
      order: 0;
    }
  }

  @media (min-width: 800px) {
    :root {
      --spacing: 5rem;
    }

    .Intro:not(.adapt) {
      margin-bottom: calc(var(--spacing) * 1.4);
      letter-spacing: -0.035em;
    }

    .title {
      font-size: 4.5rem;
      padding-top: 0.6em;
      letter-spacing: -0.035em;
    }

    .text {
      font-size: 1.5rem;
    }

    .badge {
      margin: -2.9rem 0 1.8rem;
    }
  }

  @media (min-width: 1000px) {
    .Intro:not(.adapt) {
      margin-bottom: 3rem;
    }

    .title {
      font-size: 4.75rem;
    }

    .text {
      font-size: 1.75rem;
      word-spacing: -0.04em;
    }

    .image,
    .container {
      margin: 4rem 0 0;
    }

    .badge {
      margin: -3.4rem 0 1.7rem;
    }
  }

  .container .image {
    width: 100%;
    height: 100%;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
