<script>
  import { asText } from '@prismicio/client'
  import { dev } from '$app/environment'
  import { onMount } from 'svelte'

  import { resolve } from '$lib/prismic.js'
  import Header from '$lib/Header.svelte'
  import Footer from '$lib/Footer.svelte'
  import Meta from '$lib/Meta.svelte'
  import '@beyonk/gdpr-cookie-consent-banner/banner.css'
  import GdprBanner from '@beyonk/gdpr-cookie-consent-banner'

  const gdprProps = {
    cookieName: 'ungaklara',
    cookieConfig: {
      domain: 'ungaklara.se',
      path: '/'
    },
    heading: 'Snabb fråga om cookies',
    description:
      'De används för att förbättra hemsidan och för att samla besöksstatistik.',
    acceptLabel: 'Godkänn',
    rejectLabel: 'Endast nödvändiga',
    settingsLabel: 'Välj vilka',
    closeLabel: 'Stäng',
    editLabel: 'Ändra inställningar',
    choices: {
      necessary: {
        label: 'Nödvändiga kakor',
        description:
          'Används för att vi inte ska fråga dig om cookie-inställningar igen.',
        value: true
      },
      tracking: {
        label: 'Cookies för profilering',
        description: 'Används för marknadsföring.',
        value: true
      },
      analytics: {
        label: 'Cookies för trafikanalys',
        description:
          'Används för att hantera Google Analytics, en tjänst från Google.',
        value: true
      },
      marketing: false
    },
    showEditIcon: false
  }

  let consent = false
  if (typeof localStorage !== 'undefined') {
    consent = !!localStorage.getItem('consent') || false
  }

  function handleCookies() {
    consent = true
    if (typeof localStorage === 'undefined') return
    localStorage.setItem('consent', 'true')
  }

  export let data

  let vma = true

  $: settings = data.settings.data

  onMount(() => {
    navigator.serviceWorker.getRegistrations().then((workers) => {
      for (const worker of workers) {
        // Unregister any lingering service workers from old app versions
        if (worker.active?.scriptURL?.endsWith('sw.js')) {
          worker.unregister()
        }
      }
    })
  })
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
    src="https://www.googletagmanager.com/gtag/js?id=G-9YLV4PRT5R"></script>
  <svelte:element this="script">
    {@html `
    // Google Analytics Code
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-9YLV4PRT5R'${dev ? ', {debug_mode: true}' : ''})

    //  Meta Pixel Code
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = !0
      n.version = '2.0'
      n.queue = []
      t = b.createElement(e)
      t.async = !0
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    )
    fbq('init', '1125905244708947')
    fbq('track', 'PageView')

    // TikTok Pixel Code
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
    var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
    ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
      ttq.load('CSVJSVJC77UA9SBJKHT0');
      ttq.page();
    }(window, document, 'ttq');
    `}
  </svelte:element>
</svelte:head>

<noscript>
  <img
    alt=""
    height="1"
    width="1"
    style="display:none"
    src="https://www.facebook.com/tr?id=1125905244708947&ev=PageView&noscript=1" />
</noscript>

{#if !consent}
  <GdprBanner {...gdprProps} on:analytics={handleCookies} />
{/if}

<div class="layout">
  <div class="gradient" />
  <Header items={settings.header_menu.map((item) => item.primary)}>
    {#if asText(settings.vma_heading) && vma}
      <div class="u-container">
        <div class="vma">
          <h3>
            {asText(settings.vma_heading)}

            {#if settings.vma_link && resolve(settings.vma_link)}
              <a href={resolve(settings.vma_link)}>Läs mer</a>
            {/if}
          </h3>
          <button class="close" on:click={() => (vma = false)}>Stäng</button>
        </div>
      </div>
    {/if}
  </Header>
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

  :global(
      .cookie-consent-banner::part(consent--description),
      .cookieConsent__Description
    ) {
    margin-top: 0;
  }

  :global(.cookieConsent__Button) {
    display: inline-flex;
    align-items: center;
    padding: 0 1rem 0.2rem;
    border: var(--border-width) solid rgb(var(--document-color));
    position: relative;
    font-size: 1rem;
    color: #fff;
    background: transparent;
    font-weight: 600;
    white-space: nowrap;
    user-select: none;
    text-align: center;
    font-family: var(--heading-font-family);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    border-radius: var(--border-radius);
    height: 3rem;
    cursor: pointer;
  }

  :global(.cookieConsent__Button[type='submit']) {
    color: #000;
    background: #fff;
  }

  :global(.cookieConsent__Button[type='button']) {
    padding-left: 0;
    border-left: 0;
  }

  :global(
      .cookie-consent-banner::part(operations--list),
      .cookieConsentOperations__List
    ) {
    border-radius: var(--border-radius);
    margin: 1rem;
  }

  :global(.cookieConsentOperations__Item label) {
    display: block;
    padding-bottom: 0.35rem;
    text-decoration: none;
    font-size: 1.25rem !important;
    font-family: var(--heading-font-family);
    line-height: 1.07;
    margin-top: 0.25rem;
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    text-wrap: balance;
  }

  :global(.cookieConsent__Button--Close) {
    margin-top: 0.5rem;
  }

  :global(.cookieConsentOperations) {
    align-items: center;
    justify-content: center;
    transition: none;
    user-select: none;
  }

  :global(.cookieConsentWrapper) {
    user-select: none;
    padding: 0;
  }

  :global(.cookieConsent) {
    padding: 20px;
  }
</style>
