<script>
  import parseJSON from 'date-fns/parseJSON'
  import { asText } from '@prismicio/client'
  import { fly } from 'svelte/transition'

  import hexToRgb from '$lib/utils/hex-to-rgb.js'
  import resolve from '$lib/utils/resolve.js'
  import Button from '$lib/Button.svelte'
  import Framed from '$lib/Framed.svelte'
  import Symbol from '$lib/Symbol.svelte'
  import srcset from '$lib/utils/srcset'
  import Html from '$lib/Html.svelte'
  import Scen from '../+page.svelte'

  export let data

  $: byDate = Object.values(
    data.events
      .flatMap((event) => {
        return event.production?.shows?.map((show) => {
          const [date] = show.start.split('T')
          return { event, show, date }
        })
      })
      .filter(Boolean)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .reduce((acc, item) => {
        if (item.date in acc) acc[item.date].push(item)
        else acc[item.date] = [item]
        return acc
      }, {})
  )

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

<Scen {data} tab="kalendarium">
  {#if !byDate.length}
    <Html class="u-spaceV8 u-textCenter u-sizeFull">
      <p>Kunde inte hitta något här</p>
    </Html>
  {:else}
    <ol>
      {#each byDate as items}
        {@const date = parseJSON(items[0].show.start)}
        <li class="row" in:fly={{ y: 50, duration: 200 }}>
          <h2 class="day">
            {date.toLocaleString('sv-SE', {
              weekday: 'long'
            })}, {date.toLocaleString('sv-SE', {
              year: 'numeric',
              day: 'numeric',
              month: 'long'
            })}
          </h2>
        </li>
        {#each items as { event, show }}
          {@const start = parseJSON(show.start)}
          <li
            class="row"
            in:fly={{ y: 50, duration: 200 }}
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
                  {asText(event.data.title)}
                </a>
                <br />
                <div class="meta">
                  <span class="time">
                    <span class="icon"><Symbol name="clock" /></span>
                    {start.toLocaleString('sv-SE', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23'
                    })}
                  </span>
                  <span class="location">
                    <span class="icon"><Symbol name="location" /></span>
                    {show.venue.name}
                  </span>
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
              <div class="actions">
                <Button
                  primary
                  target="_blank"
                  rel="noopener noreferrer"
                  href={event.data.buy_link.url}
                  disabled={show.stockStatus === 'SoldOut'}>
                  {show.stockStatus === 'SoldOut' ? 'Slutsålt' : 'Boka biljett'}
                </Button>
                {#if show.stockStatus === 'FewLeft'}
                  <div class="note">Fåtal kvar!</div>
                {/if}
              </div>
            </div>
          </li>
        {/each}
      {/each}
    </ol>
  {/if}
</Scen>

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
    border-bottom: 2px solid currentColor;
    font-size: 1.25rem;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
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
    border-color: rgb(var(--document-color));
    background: rgb(var(--document-color));
    color: rgb(255, 255, 255);
    mix-blend-mode: darken;
    box-shadow: 0.1em 0 0 black, -0.1em 0 0 black;
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
