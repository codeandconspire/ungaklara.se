<script>
  import { afterNavigate } from '$app/navigation'
  import { page, navigating } from '$app/stores'
  import { asText } from '@prismicio/client'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  import Pagination from '$lib/Pagination.svelte'
  import { hexToRgb } from '$lib/utils/colors.js'
  import { track } from '$lib/utils/track.js'
  import RichText from '$lib/RichText.svelte'
  import { resolve } from '$lib/prismic.js'
  import Tablist from '$lib/Tablist.svelte'
  import Filter from '$lib/Filter.svelte'
  import Intro from '$lib/Intro.svelte'
  import Event from '$lib/Event.svelte'
  import Html from '$lib/Html.svelte'
  import Tab from '$lib/Tab.svelte'

  export let data

  /** @type {'aktuellt'|'kalendarium'|'arkiv'}*/
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

  onMount(function () {
    if (tab !== 'aktuellt') return
    track('view_item_list', {
      item_list_name: 'Aktuellt',
      items: data.events.map(eventAsItem)
    })
  })

  function eventAsItem(event) {
    return {
      item_id: event.id,
      item_name: asText(event.data.title),
      item_category: 'Produktion'
    }
  }

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

  function onselectevent(event) {
    track('select_item', {
      item_list_name: 'Aktuellt',
      items: [eventAsItem(event)]
    })
  }

  function getButtons(event) {
    /** @type {{ [key: string]: any, text: string }[]}*/
    const buttons = [
      {
        text: 'Läs mer',
        href: resolve(event),
        primary: true,
        cover: true,
        onclick() {
          onselectevent(event)
        }
      }
    ]

    if (event.data.buy_link) {
      buttons.push({
        text: 'Boka biljett',
        secondary: true,
        icon: 'arrow',
        href: resolve(event.data.buy_link),
        target: '_blank',
        rel: 'noopener noreferrer',
        onclick() {
          onselectevent(event)
        }
      })
    }

    return buttons
  }

  function onpaginate(event) {
    goto(event.target.href, { replaceState: true, noScroll: true })
    event.preventDefault()
  }

  const ontabclick = (key) => (event) => {
    tab = key
    goto(event.currentTarget.href, { replaceState: true, noScroll: true })
    event.preventDefault()
  }
</script>

<div class="u-container" bind:this={root}>
  <header>
    <Intro title={asText(data.page.data.title)} />
  </header>

  <nav class="u-spaceMd">
    <Tablist selected={tab}>
      <Tab
        label="Aktuellt"
        key="aktuellt"
        href="/scen"
        on:click={ontabclick('aktuellt')} />
      <Tab
        label="Kalendarium"
        key="kalendarium"
        href="/scen/kalendarium"
        on:click={ontabclick('kalendarium')} />
      <Tab
        label="Arkiv"
        key="arkiv"
        href="/scen/arkiv"
        on:click={ontabclick('arkiv')} />
    </Tablist>

    {#if (tab === 'arkiv' && !$navigating) || $navigating?.to?.route.id === '/scen/arkiv'}
      <div class:disabled={$navigating}>
        <Filter
          {tag}
          {period}
          on:select={onselect}
          tags={data.page.data.filters
            .map((item) => item.tag)
            .filter(Boolean)} />
      </div>
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
            <h1>{asText(event.data.title)}</h1>
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
    margin-top: var(--space-lg);
  }

  .row:not(:first-child) {
    padding-top: var(--space-lg);
    border-top: var(--border-width) solid;
    margin-top: var(--space-lg);
  }
</style>
