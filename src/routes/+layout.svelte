<script>
  import { dev } from '$app/environment'

  import Header from '$lib/Header.svelte'
  import Footer from '$lib/Footer.svelte'
  import Meta from '$lib/Meta.svelte'

  export let data

  const {
    settings: { data: settings }
  } = data
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
  {@html `
    <script>
      window.dataLayer = window.dataLayer || []
      function gtag() {
        dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', 'G-TXREVFW5L2'${dev ? ', {debug_mode: true}' : ''})
    </script>
  `}
</svelte:head>

<div class="layout">
  <div class="gradient" />
  <Header items={settings.header_menu.map((item) => item.primary)} />
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
  }

  .main {
    flex-grow: 1;
    max-width: 100%;
    min-height: 100vh;
    z-index: 1;
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
</style>
