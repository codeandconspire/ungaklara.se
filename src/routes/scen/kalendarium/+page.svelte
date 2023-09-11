<script>
  import parseJSON from 'date-fns/parseJSON'
  import { asText } from '@prismicio/client'
  import { onMount } from 'svelte'

  import hexToRgb from '$lib/utils/hex-to-rgb.js'
  import resolve from '$lib/utils/resolve.js'
  import Button from '$lib/Button.svelte'
  import Framed from '$lib/Framed.svelte'
  import Symbol from '$lib/Symbol.svelte'
  import track from '$lib/utils/track.js'
  import srcset from '$lib/utils/srcset'
  import Scen from '../+page.svelte'

  export let data

  $: items = data.events
    .flatMap((event) => {
      return event.production?.shows?.map((show) => {
        const [date] = show.start.split('T')
        return { event, show, date }
      })
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .reduce((acc, item) => {
      if (!acc.length) {
        acc.push([item.date, [item]])
      } else {
        const [date, items] = acc[acc.length - 1]
        if (item.date === date) items.push(item)
        else acc.push([item.date, [item]])
      }
      return acc
    }, [])
    .flat(2)

  const onclick = (event, show) => () => {
    track('select_item', {
      item_list_name: 'Kalendarium',
      items: [showAsItem(show, event)]
    })
  }

  onMount(function () {
    track('view_item_list', {
      item_list_name: 'Kalendarium',
      items: data.events.flatMap((event) =>
        event.production?.shows.map((show) => showAsItem(show, event))
      )
    })
  })

  function showAsItem(show, event) {
    return {
      item_id: show.id,
      item_name: show.name,
      item_category: 'Föreställning',
      item_category2: asText(event.data.title),
      item_category3: parseJSON(show.start).toLocaleDateString('sv')
    }
  }

  function image(props) {
    if (!props.url) return null
    const sources = srcset(props.url, [75, 150, [300, 'q_50']])
    return {
      srcset: sources,
      sizes: '4.5rem',
      alt: props.alt || '',
      src: sources.split(' ')[0],
      ...props.dimensions
    }
  }
</script>

{#if !items.length}
  <Scen {data} tab="kalendarium" />
{:else}
  <Scen {data} tab="kalendarium">
    <ol>
      {#each items as item, index}
        {#if typeof item === 'string'}
          {@const [year, month, day] = item.split('-')}
          {@const date = new Date(+year, +month, +day)}
          <li class="row u-slideUp" style:--delay="{index * 100}ms">
            <h2 class="day">
              {date.toLocaleString('sv', {
                weekday: 'long'
              })}, {date.toLocaleString('sv', {
                year: 'numeric',
                day: 'numeric',
                month: 'long'
              })}
            </h2>
          </li>
        {:else}
          {@const { event, show } = item}
          {@const start = parseJSON(show.start)}
          <li
            class="row u-slideUp"
            style:--delay="{index * 100}ms"
            style:--theme-color={event.data.theme
              ? hexToRgb(event.data.theme)
              : null}>
            {#if event.data.poster.url}
              <div class="poster">
                <Framed size="small" {...image(event.data.poster)} />
              </div>
            {/if}
            <div class="body">
              <div>
                <a href={resolve(event)} class="link">
                  {show.name}
                </a>
                <br />
                <div class="meta">
                  <span class="time">
                    <span class="icon"><Symbol name="clock" /></span>
                    {start.toLocaleString('sv', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23'
                    })}
                  </span>
                  <span class="location">
                    <span class="icon"><Symbol name="location" /></span>
                    {show.venue.name}
                  </span>
                </div>
              </div>
              <div class="actions">
                <Button
                  primary
                  target="_blank"
                  rel="noopener noreferrer"
                  href={event.data.buy_link.url}
                  on:click={onclick(event, show)}
                  disabled={show.stockStatus === 'SoldOut'}>
                  {show.stockStatus === 'SoldOut' ? 'Slutsålt' : 'Boka biljett'}
                </Button>
                {#if show.stockStatus === 'FewLeft'}
                  <div class="note">Fåtal kvar!</div>
                {/if}
              </div>
            </div>
          </li>
        {/if}
      {/each}
    </ol>
  </Scen>
{/if}

<style>
  .row {
    display: flex;
    padding: 1.2rem 0 1.4rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    position: relative;
  }

  .poster {
    width: 6rem;
    flex-shrink: 0;
  }

  .body {
    flex: 1 1 auto;
    margin: 0.8rem 0 0 1.5rem;
    font-size: 1rem;
  }

  .note {
    margin-top: 0.45rem;
    margin-left: 0.75rem;
    font-size: 1rem;
  }

  .actions {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
    flex-wrap: wrap;
  }

  .link {
    padding-bottom: 0.05rem;
    text-decoration: none;
    font-size: 1.25rem;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
  }

  .meta {
    margin: 0.5rem 0 0.8rem;
  }

  .icon {
    font-size: 0.8em;
    position: relative;
    top: -0.05rem;
    margin-right: 0.2rem;
  }

  .time {
    display: block;
  }

  .link::before {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .link:hover {
    text-decoration: underline;
    text-underline-offset: 0.15em;
    text-decoration-thickness: var(--border-width);
  }

  .day {
    margin: 1.35rem 0 0.1rem;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    text-transform: capitalize;
    font-size: 1.125rem;
  }

  .row:first-child {
    padding-top: 0;
    margin-top: -1rem;
  }

  .detail {
    display: block;
  }

  @media (min-width: 600px) {
    .row {
      align-items: flex-start;
    }

    .body {
      font-size: 1.125rem;
      display: flex;
      margin-top: 0;
      align-items: center;
      justify-content: space-between;
    }

    .actions {
      display: block;
    }

    .note {
      text-align: right;
    }

    .actions {
      margin-left: 2rem;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 0;
    }

    .time,
    .location,
    .detail {
      display: inline-block;
      margin-right: 1.8rem;
      display: flex;
      align-items: baseline;
    }

    .link {
      font-size: 1.5rem;
    }

    .poster {
      width: 6rem;
      margin-top: 0.5rem;
    }
  }

  @media (min-width: 800px) {
    .day {
      font-size: 1.5rem;
      margin-top: 1.2rem;
    }

    .link {
      font-size: 1.875rem;
    }
  }
</style>
