<script>
  export let title = undefined
  export let collapse = false
  export let blurb = false
  export let image = null
</script>

<div class="intro" class:collapse class:blurb>
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
    <div class="text u-nudgeLg"><slot name="text" /></div>
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
    <div class="action u-nudgeLg"><slot name="action" /></div>
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
    padding-top: 20vh;
    font-family: var(--heading-font-family);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    line-height: 1.3;
    position: relative;
  }

  .collapse {
    --spacing: 2rem;
  }

  .blurb {
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

  .title {
    position: relative;
    font-size: 2.5rem;
    word-spacing: -0.05em;
    padding-top: 0.75em;
    margin: 0;
    hyphens: auto;
    line-height: 1;
    margin-left: -0.04em;
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    text-wrap: balance;
  }

  .badge {
    position: absolute;
    left: 0.04em;
    line-height: 1.4;
    margin: 0;
    display: block;
    word-spacing: 0;
    bottom: calc(100% - 0.9rem);
  }

  .text {
    font-size: 1.3rem;
    max-width: 34em;
    text-wrap: balance;
  }

  .text :global(a) {
    text-decoration: underline;
    text-underline-offset: 0.25em;
    text-decoration-thickness: var(--border-width);
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
    text-wrap: balance;
  }

  .text :global(ol > li) {
    padding-left: 0.5em;
    text-wrap: balance;
  }

  .text :global(ul > li::before) {
    content: '–';
    position: absolute;
    left: 0;
    font-weight: 600;
    color: var(--color-theme);
  }

  .text :global(li + li) {
    margin-top: 0.5em;
  }

  .image {
    background: rgba(0, 0, 0, 0.05);
    display: block;
    width: 100%;
    height: auto;
    margin: -24vh 0 0;
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

  @media (min-width: 500px) {
    .title {
      font-size: 3.2rem;
    }
  }

  @media (min-width: 600px) {
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

    .title {
      font-size: 4.5rem;
      padding-top: 0.6em;
      letter-spacing: -0.035em;
    }

    .text {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 1000px) {
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
  }

  .container .image {
    width: 100%;
    height: 100%;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: var(--border-radius);
  }
</style>
