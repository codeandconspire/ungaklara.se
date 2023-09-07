<script>
  import { onMount } from 'svelte'

  let variant = Math.ceil(Math.random() * 8)

  onMount(() => {
    variant = Math.ceil(Math.random() * 8)
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
    --indent: 0rem;

    position: relative;
    z-index: 0;
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    font-size: 1.125rem;
    word-break: break-word;
    margin: 0;
    max-width: 34em;
    padding: 0.5em 0 0 1.75em;
  }

  figcaption {
    margin-top: 1.2rem;
  }

  @media (min-width: 800px) {
    .blockquote {
      font-size: 1.125em;
      padding: 0.75em 0 0 2em;
      --indent: 0rem;
    }
  }

  @media (min-width: 1000px) {
    .blockquote {
      font-size: 1.375rem;
    }
  }

  .blockquote::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .variant-1::before,
  .variant-2::before {
    width: 7em;
    height: 7em;
    border-radius: 100%;
    background: linear-gradient(
      130deg,
      rgb(var(--color-green)) 45%,
      rgba(var(--color-green), 0) 85%,
      transparent
    );
    top: -1.25em;
    left: calc(var(--indent) * -1 - 0.5em);
  }

  .variant-2::before {
    background: linear-gradient(
      130deg,
      rgb(var(--color-yellow)) 45%,
      rgba(var(--color-yellow), 0) 85%,
      transparent
    );
  }

  .variant-3::before,
  .variant-4::before {
    width: 2.5em;
    height: calc(100% + 1em);
    background: linear-gradient(
      rgba(var(--color-pink)) 0%,
      rgba(var(--color-pink), 0) 100%,
      rgb(var(--color-pink))
    );
    top: -0.5em;
    left: calc(var(--indent) * -1);
  }

  .variant-4::before {
    background: linear-gradient(
      rgba(var(--color-yellow)) 0%,
      rgba(var(--color-yellow), 0) 100%,
      rgb(var(--color-yellow))
    );
  }

  .variant-5::before,
  .variant-6::before {
    width: 5em;
    height: 100%;
    max-height: 7em;
    background-image: linear-gradient(
        rgb(var(--color-yellow)) 20%,
        rgba(var(--color-yellow), 0)
      ),
      linear-gradient(
        rgb(var(--color-yellow)) 20%,
        rgba(var(--color-yellow), 0)
      );
    background-position: 0 0, 2.2em 0;
    background-size: 1.5em 100%, 1.5em 100%;
    background-repeat: no-repeat;
    top: -0.5em;
    left: calc(var(--indent) * -1);
  }

  .variant-6::before {
    background-image: linear-gradient(
        rgb(var(--color-pink)) 20%,
        rgba(var(--color-pink), 0)
      ),
      linear-gradient(
        rgb(var(--color-pink)) 20%,
        rgba(var(--color-pink), 0)
      );
  }

  .variant-7::before,
  .variant-7::after,
  .variant-8::before,
  .variant-8::after {
    content: '';
    position: absolute;
    left: calc(var(--indent) * -1);
    top: -1em;
    z-index: -1;
    width: 6em;
    height: 6em;
    background-size: 100%;
    background-image: linear-gradient(
      135deg,
      rgba(var(--theme-color)) 0%,
      rgba(var(--theme-color), 0) 100%
    );
  }

  .variant-8::before {
    background-image: linear-gradient(
      135deg,
      rgba(var(--color-green)) 0%,
      rgba(var(--color-green), 0) 100%
    );
  }

  .variant-7::after,
  .variant-8::after {
    width: 3em;
    height: 3em;
    top: 0.5em;
    margin-left: 1.5em;
    background: rgb(var(--document-background));
  }
</style>
