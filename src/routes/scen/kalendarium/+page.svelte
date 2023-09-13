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
    const sources = srcset(props.url, [75, 150, [300, 'q_60']])
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
    <ol class="u-spaceLg">
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
                <div class="meta">
                  <span class="location">
                    <span class="icon"><Symbol name="location" /></span>
                    {show.venue.name}
                  </span>
                  <span class="time">
                    <span class="icon"><Symbol name="clock" /></span>
                    {start.toLocaleString('sv', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23'
                    })}
                  </span>
                  {#if show.stockStatus === 'SoldOut'}
                    <span class="note">
                      {#if show.stockStatus === 'SoldOut'}Slutsåld{/if}
                    </span>
                  {/if}

                  {#if show.misc}
                    <!-- This is not yet implemented, don't know where to put it -->
                    <span class="detail">
                      <span class="icon">
                        <Symbol name="check" />
                      </span>
                      {show.misc}
                    </span>
                  {/if}
                </div>
              </div>
              <div class="actions {show.stockStatus === 'SoldOut' ? 'unavailable' : ''}">
                {#if show.stockStatus !== 'SoldOut'}
                  <Button
                    primary
                    target="_blank"
                    rel="noopener noreferrer"
                    href={event.data.buy_link.url}
                    disabled={show.stockStatus === 'SoldOut'}>Boka biljett</Button>
                  {#if show.stockStatus === 'FewLeft'}
                    <span class="late">
                      {#if show.stockStatus === 'FewLeft'}Få kvar!{/if}
                    </span>
                  {/if}
                {/if}
                {#if show.stockStatus === 'SoldOut'}
                  <span class="note">
                    {#if show.stockStatus === 'SoldOut'}Slutsåld{/if}
                  </span>
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
    margin: 1rem 0;
    position: relative;
  }

  .day {
    display: block;
    width: 100%;
    border-bottom: var(--border-width) solid;
    margin: 1.5rem 0 0;
    padding: 0 0 0.5rem;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    text-transform: capitalize;
    font-size: 1rem;
  }

  @media (min-width: 800px) {
    .day {
      font-size: 1.25rem;
      margin-top: 2rem;
    }
  }

  .poster {
    width: 4rem;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }

  .body {
    flex: 1 1 auto;
    font-size: 1rem;
    margin-left: 1rem;
  }

  .actions {
    position: relative;
    margin-top: 0.5rem;
    display: flex;
    align-items: baseline;
    white-space: nowrap;
    flex-wrap: wrap;
  }

  .actions .note {
    display: none;
  }

  .link {
    display: block;
    padding-bottom: 0.05rem;
    text-decoration: none;
    font-size: 1.5rem;
    font-family: var(--heading-font-family);
    line-height: 1.07;
    margin-top: 0.25rem;
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    text-wrap: balance;
  }

  @media (min-width: 800px) {
    .link {
      font-size: 1.875rem;
    }
  }

  .meta {
    margin-top: 0.25rem;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0;
  }

  .icon {
    font-size: 0.8em;
    position: relative;
  }

  .time,
  .location,
  .note,
  .detail {
    display: inline-block;
    margin-right: 1rem;
    display: flex;
    align-items: baseline;
  }

  .location {
    display: none;
  }

  .time {
    display: block;
  }

  .note {
  }

  .late {
    background: rgb(var(--theme-color));
    display: block;
    border-radius: var(--border-radius);
    width: 5rem;
    height: 2rem;
    white-space: normal;
    line-height: 0.9;
    text-align: center;
    padding-top: 0.56rem;
    transform: rotate(-9deg);
    font-weight: 600;
    font-family: var(--heading-font-family);
    font-size: 0.9rem;
    position: absolute;
    left: 4.3rem;
    top: 2.3rem;
  }

  @media (min-width: 1000px) {
    .location {
      display: block;
    }

    .note {
      display: none;
    }

    .actions .note {
      display: block;
      margin-right: 0;
      text-align: right;
      margin-top: 0.25rem;
    }

    .late {
      transform: rotate(9deg);
      left: 5.1rem;
      top: -1.2rem;
    }

    .actions .note:first-child {
      margin-top: 0;
    }
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

  .row:first-child {
    margin-top: -2.5rem;
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
      margin-left: 1.5rem;
      align-items: flex-start;
      justify-content: space-between;
    }

    .actions {
      display: block;
      margin-left: 2rem;
      margin-top: 1.25rem;
    }

    .link {
      font-size: 1.5rem;
      margin-top: 1rem;
    }

    .poster {
      width: 6rem;
    }
  }
</style>
