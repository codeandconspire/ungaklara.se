<script>
  import { onMount } from "svelte"

  let variant = 1

  onMount(() => {
    variant = Math.ceil(Math.random() * 4);
  })
</script>

<div class="blockquote variant-{variant}">
  <figure>
    <blockquote><slot name="text" /></blockquote>
    {#if $$slots.cite}
      <figcaption><slot name="cite" /></figcaption>
    {/if}
  </figure>
</div>

<style>
 .blockquote {
    position: relative;
    z-index: 0;
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    font-size: 1em;
    word-break: break-word;
    margin: 3rem 0 3rem 1rem;
    max-width: 42rem;
  }

  figcaption {
    margin-top: 1.2rem;
  }

  @media (min-width: 800px) {
    .blockquote {
      margin-left: 0;
      font-size: 1.125em;
    }
  }

  .blockquote::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .variant-1::before {
    width: 7em;
    height: 7em;
    border-radius: 100%;
    background: linear-gradient(130deg, rgb(var(--color-green)) 45%, rgba(var(--color-green), 0) 85%, transparent);
    top: -1.5em;
    left: -1.5em;
  }

  .variant-2::before {
    width: 2.5em;
    height: calc(100% + 2em);
    background: linear-gradient( rgba(var(--color-pink)) 0%, rgba(var(--color-pink), 0) 100%, rgb(var(--color-pink)) );
    top: -1em;
    left: -1em;
  }

  .variant-3::before {
    width: 5em;
    height: 100%;
    max-height: 7em;
    background-image: linear-gradient( rgb(var(--color-yellow)) 20%, rgba(var(--color-yellow), 0) ), linear-gradient( rgb(var(--color-yellow)) 20%, rgba(var(--color-yellow), 0) );
    background-position: 0 0, 2.2em 0;
    background-size: 1.5em 100%, 1.5em 100%;
    background-repeat: no-repeat;
    top: -1em;
    left: -1em;
  }

  .variant-4::before,
  .variant-4::after {
    content: '';
    position: absolute;
    left: -1em;
    top: -1em;
    z-index: -1;
    width: 6em;
    height: 6em;
    background-size: 100%;
    background-image: linear-gradient(135deg, rgba(var(--theme-color)) 0%, rgba(var(--theme-color), 0) 100%);
  }

  .variant-4::after {
    width: 3em;
    height: 3em;
    top: 0.5em;
    left: 0.5em;
    background: rgb(var(--document-background));
  }
</style>
