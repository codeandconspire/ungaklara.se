<script>
  import { dev } from '$app/environment'
  import { asText } from '@prismicio/client'
  import { resolve } from '$lib/prismic.js'
  import Header from '$lib/Header.svelte'
  import Footer from '$lib/Footer.svelte'
  import Meta from '$lib/Meta.svelte'

  export let data

  let vma = true

  $: settings = data.settings.data
</script>

<svelte:head>
  <Meta />

  <script>
    document.documentElement.setAttribute('scripting-enabled', '')
    window.onerror = function () {
      document.documentElement.removeAttribute('scripting-enabled')
      document.documentElement.setAttribute('scripting-initial-only', '')
    }
  </script>

  {#if data.previewToken}
    <script
      async
      defer
      src="https://static.cdn.prismic.io/prismic.js?new=true&repo=unga-klara"></script>
  {/if}

  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-TXREVFW5L2"></script>
  <svelte:element this="script">
    {@html `
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-TXREVFW5L2'${dev ? ', {debug_mode: true}' : ''})`}
  </svelte:element>
</svelte:head>

<div class="layout">
  <div class="gradient" />
  <Header items={settings.header_menu.map((item) => item.primary)} />
  {#if asText(settings.vma_heading) && vma}
    <div class="u-container">
      <div class="vma">
        <h3>
          {asText(settings.vma_heading)}
          {#if settings.vma_link}
            <a href={resolve(settings.vma_link)}>Läs mer</a>
          {/if}
        </h3>
        <button class="close" on:click={() => (vma = false)}>Stäng</button>
      </div>
    </div>
  {/if}
  <div class="main">
    <slot />
  </div>
  <Footer {settings} />
</div>

<style>
  @import '$lib/index.css';

  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    position: relative;
    min-width: var(--document-min-width);
    overflow-x: hidden;
  }

  .main {
    flex-grow: 1;
    max-width: 100%;
    min-height: 100vh;
  }

  .gradient {
    width: 100%;
    height: calc(100% - 200vh);
    position: absolute;
    top: 100vh;
    left: 0;
    z-index: -1;
    background: rgb(var(--document-background));
  }

  .gradient::before,
  .gradient::after {
    content: '';
    width: 100%;
    height: 100vh;
    position: absolute;
    top: calc(100vh * -1);
    z-index: 0;
    background: linear-gradient(
      rgba(var(--document-background), 0) 0%,
      rgba(var(--document-background), 1) 100%
    );
    pointer-events: none;
  }

  .gradient::after {
    height: 100vh;
    top: calc(100% - 1px);
    transform: rotate(180deg);
  }

  .vma {
    padding: 1.25rem 4.5rem 1.25rem 1.25rem;
    background: black;
    border-radius: var(--border-radius);
    color: #fff;
    margin-top: 1rem;
    font-family: var(--heading-font-family);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    line-height: 1.3;
    position: relative;
  }

  .vma h3 {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em 1em;
    max-width: 55em;
  }

  .vma a {
    text-underline-offset: 0.25em;
    text-decoration-thickness: var(--border-width);
    text-decoration: underline;
    white-space: nowrap;
  }

  .vma .close {
    font-size: 0;
    color: transparent;
    line-height: 0.5rem;
    top: 0.25rem;
    position: absolute;
    cursor: pointer;
    padding: 0.5rem;
    top: 0.9rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vma .close::after {
    display: block;
    content: '⨉';
    font-size: 1.25rem;
    color: #000;
    position: relative;
    top: -0.2rem;
  }

  @media (min-width: 800px) {
    .vma {
      font-size: 1.25rem;
      padding: 1.5rem 1.75rem;
      margin-top: 2rem;
    }

    .vma .close {
      top: 1.3rem;
      right: 1.5rem;
    }
  }
</style>
