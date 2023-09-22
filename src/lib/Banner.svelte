<script>
  import Html from '$lib/Html.svelte'

  export let image = null
  export let background = null
  export let title = undefined
  export let link = undefined
  export let tag = undefined
  export let desc = undefined
</script>

<div class="banner">
  {#if background}
    <div class="background">
      <img alt="" {...background} class="image" />
    </div>
  {/if}
  <div class="main" class:narrow={background}>
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

  .main,
  .background {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 700px) {
    .narrow {
      max-width: 80%;
      margin: 0 auto;
    }
  }

  .background {
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  }

  .background .image {
    width: 150vw;
    height: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: -1;
    transform: translate(-50%, -50%);
  }

  @media (min-width: 700px) {
    .background .image {
      width: 125vw;
    }
  }

  @media (min-width: 1400px) {
    .background .image {
      width: 100vw;
    }
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
    .body {
      position: absolute;
      inset: 0;
      color: #fff;
      background: transparent;
      z-index: 1;
    }

    .body::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(0, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 60%);
      border-radius: var(--border-radius);
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
