<script>
  import { page, navigating } from '$app/stores'
  import { asText } from '@prismicio/client'
  import { quintOut } from 'svelte/easing'
  import { goto } from '$app/navigation'

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

  function appear(node, params) {
    return {
      delay: 0,
      duration: 200,
      easing: quintOut,
      css: (t, u) => `opacity: ${t}; transform: translateY(${50 * t}px);`
    }
  }
</script>

<div class="u-container">
  <header>
    <Intro title={asText(data.page.data.title)} adapt />
  </header>

  <nav>
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

  {#if asText(data.page.data.notice.length)}
    <div class="notice">
      <Html>
        <RichText content={data.page.data.notice} />
      </Html>
    </div>
  {/if}

  {#if $navigating}
    <Html class="u-spaceV8 u-textCenter u-sizeFull">
      <p>Hämtar föreställningar</p>
    </Html>
  {:else if !data.events.length}
    <Html class="u-spaceV8 u-textCenter u-sizeFull">
      <p>Kunde inte hitta något här</p>
    </Html>
  {:else if tab === 'aktuellt'}
    <ol class="rows">
      {#each data.events as event}
        <li
          in:appear
          class="row"
          style:--theme-color={event.data.theme
            ? hexToRgb(event.data.theme)
            : null}>
          <Event
            teaser
            buttons={[
              {
                text: 'Läs mer',
                href: resolve(event),
                primary: true,
                cover: true
              },
              {
                text: 'Boka biljett',
                secondary: true,
                icon: 'arrow',
                href: resolve(event.data.buy_link),
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            ]}
            image={event.data.poster}
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
      <Html class="u-spaceV8 u-textCenter u-sizeFull">
        <p>Kunde inte hitta något här</p>
      </Html>
    </slot>
  {/if}

  <!-- ${pages && pages.length === page * PAGE_SIZE
    ? pagination({
        href: getHrefWithParam('page', page + 1),
        onclick: onpaginate
      })
    : null} -->
</div>

<style>
  .rows {
    margin-top: 4.5rem;
  }

  .row:not(:first-child) {
    padding-top: 0.8rem;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
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

  .notice {
    padding: 0.2rem 0 2rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    margin-bottom: 2.8rem !important;
  }

  @media (min-width: 600px) {
    .notice {
      padding: 0.4rem 0 2.75rem;
      margin-bottom: 3.75rem !important;
    }
  }
</style>
