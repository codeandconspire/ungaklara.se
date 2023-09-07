<script>
  import { afterNavigate } from '$app/navigation'
  import { page, navigating } from '$app/stores'
  import { asText } from '@prismicio/client'
  import { goto } from '$app/navigation'

  import Pagination from '$lib/Pagination.svelte'
  import hexToRgb from '$lib/utils/hex-to-rgb'
  import resolve from '$lib/utils/resolve.js'
  import RichText from '$lib/RichText.svelte'
  import Tablist from '$lib/Tablist.svelte'
  import Filter from '$lib/Filter.svelte'
  import Intro from '$lib/Intro.svelte'
  import Event from '$lib/Event.svelte'
  import Html from '$lib/Html.svelte'
  import Tab from '$lib/Tab.svelte'

  export let data

  /** @type {'aktuellt'|'kalendarium'|'arkiv'|'salong'}*/
  export let tab = 'aktuellt'

  /** @type {string?} */
  export let tag = null

  /** @type {string?} */
  export let period = null

  let root
  let hasMounted = false

  afterNavigate(function () {
    // Prevent scrolling on initial load
    if (hasMounted) {
      root.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    hasMounted = true
  })

  function onselect(event) {
    const { detail } = event

    tag = detail.tag
    period = detail.period

    const url = new URL($page.url)
    for (const [key, value] of Object.entries(detail)) {
      url.searchParams.set(key, value)
    }
    goto(url, { noScroll: true })
  }

  function getButtons(event) {
    /** @type {{ [key: string]: any, text: string }[]}*/
    const buttons = [
      {
        text: 'Läs mer',
        href: resolve(event),
        primary: true,
        cover: true
      }
    ]

    if (
      event.production?.shows.some((show) => show.stockStatus !== 'SoldOut')
    ) {
      buttons.push({
        text: 'Boka biljett',
        secondary: true,
        icon: 'arrow',
        href: resolve(event.data.buy_link),
        target: '_blank',
        rel: 'noopener noreferrer'
      })
    }

    return buttons
  }

  function onpaginate(event) {
    goto(event.target.href, { replaceState: true, noScroll: true })
    event.preventDefault()
  }
</script>

<div class="u-container" class:disabled={$navigating} bind:this={root}>
  <header>
    <Intro title={asText(data.page.data.title)} adapt />
  </header>

  <nav class="u-spaceMd">
    <Tablist selected={tab}>
      <Tab label="Aktuellt" key="aktuellt" href="/scen" />
      <Tab label="Kalendarium" key="kalendarium" href="/scen/kalendarium" />
      <Tab label="Arkiv" key="arkiv" href="/scen/arkiv" />
      <Tab label="Salong" key="salong" href="/scen/salong" />
    </Tablist>

    {#if (tab === 'arkiv' && !$navigating) || $navigating?.to?.route.id === '/scen/arkiv'}
      <Filter
        {tag}
        {period}
        on:select={onselect}
        tags={data.page.data.filters.map((item) => item.tag).filter(Boolean)} />
    {/if}
  </nav>

  {#if $navigating && $navigating?.from?.route.id !== $navigating?.to?.route.id}
    <Html class="u-spaceMd u-textCenter u-sizeFull">
      <p class="u-sizeFull">Hämtar föreställningar</p>
    </Html>
  {:else if !data.events.length}
    <Html class="u-spaceMd u-textCenter u-sizeFull">
      <p class="u-sizeFull">Kunde inte hitta något här</p>
    </Html>
  {:else if tab === 'aktuellt'}
    <ol class="rows">
      {#each data.events as event, index (event.id)}
        <li
          class="row u-slideUp"
          style:--delay="{index * 150}ms"
          style:--theme-color={event.data.theme
            ? hexToRgb(event.data.theme)
            : null}>
          <Event
            teaser
            image={event.data.poster}
            buttons={getButtons(event)}
            label={[event.data.category, event.data.shortname]
              .filter(Boolean)
              .join(' – ')}>
            <h2>{asText(event.data.title)}</h2>
            <RichText content={event.data.description} />
          </Event>
        </li>
      {/each}
    </ol>
  {:else}
    <slot>
      <Html class="u-spaceMd u-textCenter u-sizeFull">
        <p class="u-sizeFull">Kunde inte hitta något här</p>
      </Html>
    </slot>
  {/if}
  {#if data.total > 1 && (!$navigating || $navigating?.from?.route.id === $navigating?.to?.route.id)}
    <div class="u-spaceMd">
      <Pagination index={data.index} total={data.total} on:click={onpaginate} />
    </div>
  {/if}
</div>

<style>
  .disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  .rows {
    margin-top: 4.5rem;
  }

  .row:not(:first-child) {
    padding-top: 0.8rem;
    border-top: var(--border-width) solid;
    margin-top: 2.5rem;
  }

  @media (min-width: 600px) {
    .row:not(:first-child) {
      padding-top: 2rem;
      margin-top: 4rem;
    }
  }

  @media (min-width: 1000px) {
    .row:not(:first-child) {
      margin-top: 5rem;
    }
  }
</style>
