<script>
  import { asText } from '@prismicio/client'
  import { quintOut } from 'svelte/easing'
  import { page } from '$app/stores'

  import hexToRgb from '$lib/utils/hex-to-rgb'
  import resolve from '$lib/utils/resolve.js'
  import RichText from '$lib/RichText.svelte'
  import Tablist from '$lib/Tablist.svelte'
  import Button from '$lib/Button.svelte'
  import Filter from '$lib/Filter.svelte'
  import Intro from '$lib/Intro.svelte'
  import Event from '$lib/Event.svelte'
  import Html from '$lib/Html.svelte'
  import Tab from '$lib/Tab.svelte'

  export let data
  export let tab
  export let tag
  export let period

  function onselect(event) {
    tab = event.details
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
      <Tab label="Aktuellt" key="scen" href="/scen" />
      <Tab label="Kalendarium" key="kalendarium" href="/scen/kalendarium" />
      <Tab label="Arkiv" key="arkiv" href="/scen/arkiv" />
      <Tab label="Salong" key="salong" href="/scen/salong" />
    </Tablist>

    {#if tab === 'arkiv'}
      <Filter
        options={data.page.data.filters}
        selected={tag || period}
        on:select={onselect} />
    {/if}
  </nav>

  {#if data.page?.data.notice}
    <div class="notice">
      <Html>
        <RichText content={data.page.data.notice} />
      </Html>
    </div>
  {/if}

  {#if !data.events.length}
    <Html class="u-spaceV8 u-textCenter u-sizeFull">
      <p>Kunde inte hitta något här</p>
    </Html>
  {:else if tab == null}
    <ol>
      {#each data.events as event}
        <li
          in:appear
          class="row"
          style:--theme-color={event.data.theme
            ? hexToRgb(event.data.theme)
            : null}>
          <Event
            teaser
            href={resolve(event)}
            image={event.data.poster}
            ticket={resolve(event.data.buy_link)}
            label={[event.data.category, event.data.shortname]
              .filter(Boolean)
              .join(' – ')}>
            <h2>{asText(event.data.title)}</h2>
            <RichText content={event.data.description} />
          </Event>
        </li>
      {/each}
    </ol>
  {/if}

  <!-- ${pages && pages.length === page * PAGE_SIZE
    ? pagination({
        href: getHrefWithParam('page', page + 1),
        onclick: onpaginate
      })
    : null} -->
</div>

<style>
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
