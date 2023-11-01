<script>
  import Html from '$lib/Html.svelte'

  export let image = null
  export let title = undefined
  export let link = undefined
  export let tag = undefined
  export let desc = undefined
  export let top = false
</script>

<div class="banner" class:top>
  <div class="main">
    <img alt="" {...image} class="image" />
    {#if title || desc || tag}
      <div class="body u-paddedBox">
        {#if tag}
          <span class="u-textLabel">{tag}</span>
        {/if}
        <Html size="large">
          {#if title}
            <h1>{title}</h1>
          {/if}
          {#if desc}
            <p>{desc}</p>
          {/if}
        </Html>
      </div>
    {/if}
    {#if link}
      <a class="link" href={link}>Läs mer</a>
    {/if}
  </div>
</div>

<style>
  .banner {
    position: relative;
    border-radius: var(--border-radius);
    background: #000;
  }

  .image {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--border-radius);
  }

  .main {
    position: relative;
  }

  .main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .body {
    background: rgb(var(--theme-color));
    display: flex;
    flex-direction: column;
    color: var(--theme-color-is-dark, #000);
    justify-content: flex-end;
    margin-top: -3px;
  }

  @media (min-width: 700px) {
    .banner {
      border-radius: 0;
    }

    .main {
      height: 100vh;
      height: 100svh;
      min-height: 23rem;
    }

    .image {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100vw;
      object-fit: cover;
      object-position: center;
    }

    .image {
      border-radius: 0;
    }

    .body {
      position: absolute;
      inset: 0;
      color: #fff;
      background: transparent;
      z-index: 1;
      padding: var(--document-margin) !important;
    }

    .body::before,
    .body::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100vw;
      width: 200vw;
      height: 100%;
      z-index: -1;
      background: linear-gradient(0, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 45%);
      border-radius: var(--border-radius);
    }

    .body::after {
      display: none;
    }

    .top .body::after {
      transform: rotate(180deg);
      display: block;
    }
  }

  .body :global(p) {
    text-wrap: balance;
    max-width: 35em;
  }

  .link {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: block;
    font-size: 0;
    color: transparent;
  }
</style>
