<script context="module">
  export const INITAIL_TICKET_COUNT = 6
</script>

<script>
  import { asText } from '@prismicio/client'
  import { browser } from '$app/environment'
  import parseJSON from 'date-fns/parseJSON'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import Blockquote from '$lib/Blockquote.svelte'
  import resolve from '$lib/utils/resolve.js'
  import FactsBox from '$lib/FactsBox.svelte'
  import RichText from '$lib/RichText.svelte'
  import GridCell from '$lib/GridCell.svelte'
  import ShowMore from '$lib/ShowMore.svelte'
  import Hashtag from '$lib/Hashtag.svelte'
  import Spotify from '$lib/Spotify.svelte'
  import Masonry from '$lib/Masonry.svelte'
  import Trailer from '$lib/Trailer.svelte'
  import srcset from '$lib/utils/srcset.js'
  import Ticket from '$lib/Ticket.svelte'
  import Intro from '$lib/Intro.svelte'
  import Embed from '$lib/Embed.svelte'
  import Event from '$lib/Event.svelte'
  import Card from '$lib/Card.svelte'
  import Html from '$lib/Html.svelte'
  import Grid from '$lib/Grid.svelte'

  export let data

  $: videos = data.page.data.videos.filter((group) => group.video.embed_url)
  $: shows = data.production?.shows?.filter(
    (show) => +parseJSON(show.start) > Date.now()
  )
  $: images = data.page.data.media.filter(
    (slice) => slice.slice_type === 'image' && slice.primary.image.url
  )
  $: quotes = data.page.data.media.filter(
    (slice) => slice.slice_type === 'quote' && slice.primary.text.length
  )
  $: team = data.page.data.team.filter(
    (slice) =>
      slice.slice_type === 'group' &&
      slice.primary.heading.length &&
      slice.items.length
  )

  const ontoggle = (event) =>
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })

  const small = browser ? window.matchMedia('(min-width: 600px)') : null
  const medium = browser ? window.matchMedia('(min-width: 800px)') : null
  const large = browser ? window.matchMedia('(min-width: 1000px)') : null

  let tickets
  let isSmall = false
  let isMedium = false
  let isLarge = false
  let showAll = $page.url.searchParams.has('showAll')

  onMount(measure)

  function measure() {
    isSmall = Boolean(small?.matches)
    isMedium = Boolean(medium?.matches)
    isLarge = Boolean(large?.matches)
  }

  function onShowAll(event) {
    showAll = true
    tickets.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
    event.preventDefault()
  }

  function heroImage(props) {
    if (!props.url) return null
    return {
      alt: props.alt || '',
      sizes: '100vw',
      srcset: srcset(props.url, [
        400,
        600,
        800,
        1200,
        [1800, 'q_80'],
        [2600, 'q_50']
      ]),
      src: srcset(props.url, [900]).split(' ')[0],
      ...props.dimensions
    }
  }

  function resourceImage(props) {
    if (!props.url) return null
    return {
      srcset: srcset(props.url, [200, 400, 600, 900, [1600, 'q_60,c_thumb']], {
        transforms: 'c_thumb'
      }),
      sizes: '(min-width: 600px) 50vw, 100vw',
      alt: props.alt || '',
      src: srcset(props.url, [[900, 'c_thumb']]).split(' ')[0],
      ...props.dimensions
    }
  }
</script>

<svelte:window on:resize={measure} />

<header class="u-container">
  <Intro
    title={asText(data.page.data.title)}
    image={heroImage(data.page.data.image)}>
    <span slot="badge">
      {[data.page.data.category, data.page.data.subheading]
        .filter(Boolean)
        .join(' – ')}
    </span>
    {#if data.page.data.hashtag && !videos.length}
      {@const href = resolve(data.page.data.hashtag_link)}
      {@const external = data.page.data.hashtag_link.target === '_blank'}
      {#if href}
        <a
          {href}
          target={external ? '_blank' : null}
          rel={external ? 'noopenere noreferrer' : null}>
          <Hashtag text={data.page.data.hashtag} />
        </a>
      {:else}
        <Hashtag text={data.page.data.hashtag} />
      {/if}
    {/if}
    <RichText slot="text" content={data.page.data.description} />
  </Intro>
</header>

<div class="u-spaceMd u-container">
  <Event
    buttons={data.production?.shows?.length
      ? [
          {
            href: '#tickets',
            icon: 'calendar',
            text: 'Visa spelschema'
          },
          {
            text: 'Boka biljett',
            href: resolve(data.page.data.buy_link),
            primary: true,
            icon: 'arrow',
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        ]
      : []}
    image={data.page.data.poster.url ? data.page.data.poster : null}>
    <RichText content={data.page.data.about} />
  </Event>
</div>

<div class="u-spaceLg u-container">
  <FactsBox items={data.page.data.details} />
</div>

{#if !isSmall}
  {#if videos.length}
    <div class="u-spaceLg u-posRelative u-container">
      {#if data.page.data.hashtag}
        {@const href = resolve(data.page.data.hashtag_link)}
        {@const external = data.page.data.hashtag_link.target === '_blank'}
        {#if href}
          <a
            {href}
            target={external ? '_blank' : null}
            rel={external ? 'noopenere noreferrer' : null}>
            <Hashtag text={data.page.data.hashtag} />
          </a>
        {:else}
          <Hashtag text={data.page.data.hashtag} />
        {/if}
      {/if}
      {#if videos.length > 1}
        <div class="u-uncontain">
          <Grid carousel>
            {#each videos as { video }}
              <GridCell>
                <Embed content={video} />
              </GridCell>
            {/each}
          </Grid>
        </div>
      {:else}
        <Embed content={videos[0].video} />
      {/if}
    </div>
  {/if}

  {@const spotify = data.page.data.media.filter(
    (slice) => slice.slice_type === 'spotify'
  )}
  {#if spotify.length === 1}
    <div class="u-spaceMd u-container">
      <Spotify url={spotify[0].primary.uri.embed_url}>
        <RichText content={spotify[0].primary.text} />
      </Spotify>
    </div>
  {:else if spotify.length > 1}
    <div class="u-uncontain u-spaceMd">
      <Grid carousel>
        {#each spotify as slice}
          <GridCell>
            <Spotify url={slice.primary.uri.embed_url}>
              <RichText content={slice.primary.text} />
            </Spotify>
          </GridCell>
        {/each}
      </Grid>
    </div>
  {/if}

  {#if images.length || quotes.length || team.length}
    <Html class="u-spaceMd u-container">
      {#if images.length}
        <details on:toggle={ontoggle}>
          <summary>Bilder</summary>
          <Grid carousel>
            {#each images as slice}
              {@const { dimensions, url, alt = '' } = slice.primary.image}
              {@const sources = srcset(url, [400, 599, 900, [1500, 'q_40']])}
              <GridCell>
                <figure class="u-sizeFull">
                  <Html>
                    <div
                      class="aspect"
                      style:--aspect={dimensions
                        ? (100 * dimensions.height) / dimensions.width
                        : null}>
                      <img
                        {alt}
                        class="image"
                        srcset={sources}
                        sizes="(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw"
                        src={sources.split(' ')[0]}
                        {...dimensions} />
                    </div>
                    {#if slice.primary.caption}
                      <figcaption class="muted small">
                        {slice.primary.caption}
                      </figcaption>
                    {/if}
                  </Html>
                </figure>
              </GridCell>
            {/each}
          </Grid>
        </details>
      {/if}

      {#if quotes.length}
        <details on:toggle={ontoggle}>
          <summary>Presscitat</summary>
          {#each quotes as slice}
            <Blockquote>
              <RichText slot="text" content={slice.primary.text} />
              <RichText slot="caption" content={slice.primary.cite} />
            </Blockquote>
          {/each}
        </details>
      {/if}

      {#each team as slice}
        {@const hasImage = slice.items.some((item) => item.image.url)}
        <details on:toggle={ontoggle}>
          <summary>{asText(slice.primary.heading)}</summary>
          <Grid size={{ xs: hasImage ? '1of2' : null, md: '1of3', lg: '1of4' }}>
            {#each slice.items as item}
              <GridCell>
                <div class="u-sizeFull">
                  <Html>
                    {#if item.image.url}
                      {@const sources = srcset(
                        item.image.url,
                        [200, 400, [800, 'q_50']],
                        { aspect: 4 / 3 }
                      )}
                      <img
                        sizes="13em"
                        srcset={sources}
                        style="max-width: 10rem"
                        alt={item.image.alt || ''}
                        src={sources.split(' ')[0]}
                        width="200"
                        height={200 * (4 / 3)} />
                    {:else if hasImage}
                      <img
                        alt=""
                        width="200"
                        height={200 * (4 / 3)}
                        style="max-width: 10rem; background-color: {data.page
                          .data.theme || 'rgb(--color-gray-dark)'};" />
                    {/if}
                    {#if item.label}
                      <strong class="label u-nudgeMd">{item.label}</strong>
                    {/if}
                    <div class:u-nudgeMd={!item.label}>
                      <RichText content={item.text} />
                    </div>
                  </Html>
                </div>
              </GridCell>
            {/each}
          </Grid>
        </details>
      {/each}
    </Html>
  {/if}
{:else}
  <div class="u-spaceMd u-container">
    <Masonry
      let:item={slice}
      gap={isLarge ? 24 : isMedium ? 32 : 24}
      items={data.page.data.media.map((slice, index) => ({
        id: `${slice.slice_type}-${index}`,
        ...slice
      }))}>
      {#if slice.slice_type === 'image'}
        {@const { dimensions, url, alt = '' } = slice.primary.image}
        {@const sources = srcset(url, [400, 599, 900, [1500, 'q_40']])}
        <figure class="u-sizeFull">
          <Html>
            <div
              class="aspect"
              style:--aspect={dimensions
                ? (100 * dimensions.height) / dimensions.width
                : null}>
              <img
                {alt}
                class="image"
                srcset={sources}
                sizes="(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw"
                src={sources.split(' ')[0]}
                {...dimensions} />
            </div>
            {#if slice.primary.caption}
              <figcaption class="muted small">
                {slice.primary.caption}
              </figcaption>
            {/if}
          </Html>
        </figure>
      {/if}

      {#if slice.slice_type === 'quote'}
        <Blockquote>
          <RichText slot="text" content={slice.primary.text} />
          <RichText slot="caption" content={slice.primary.cite} />
        </Blockquote>
      {/if}

      {#if slice.slice_type === 'spotify'}
        <Spotify url={slice.primary.uri.embed_url}>
          <RichText content={slice.primary.text} />
        </Spotify>
      {/if}
    </Masonry>
  </div>

  {#if videos.length}
    {@const background = data.page.data.featured_background}
    <div class="u-spaceLg">
      <Trailer
        background={background.url
          ? {
              src: srcset(background.url, [900]).split(' ')[0],
              sizes:
                '(min-width: 2000px) 100vw, (min-width: 1600px) 120vw, (min-width: 1400px) 110vw, (min-width: 1000px) 130vw, 150vw',
              srcset: srcset(background.url, [
                400,
                900,
                [1800, 'q_50'],
                [2600, 'q_30']
              ]),
              ...background.dimensions
            }
          : null}>
        <div slot="primary">
          {#if data.page.data.hashtag}
            {@const href = resolve(data.page.data.hashtag_link)}
            {@const external = data.page.data.hashtag_link.target === '_blank'}
            {#if href}
              <a
                {href}
                target={external ? '_blank' : null}
                rel={external ? 'noopenere noreferrer' : null}>
                <Hashtag text={data.page.data.hashtag} />
              </a>
            {:else}
              <Hashtag text={data.page.data.hashtag} />
            {/if}
          {/if}
          <Embed content={videos[0].video} />
        </div>
        <div slot="secondary">
          {#if videos.length > 1}
            <Grid size={{ md: `1of${videos.length - 1 < 3 ? 2 : 3}` }}>
              {#each videos.slice(1) as { video }}
                <GridCell>
                  <Embed content={video} />
                </GridCell>
              {/each}
            </Grid>
          {/if}
        </div>
      </Trailer>
    </div>
  {/if}

  {#if team.length}
    {#each team as slice}
      {@const hasImage = slice.items.some((item) => item.image.url)}
      <section class="u-spaceLg u-container">
        <Html>
          <h2>{asText(slice.primary.heading)}</h2>
        </Html>
        <Grid
          class="u-spaceSm"
          size={{ xs: hasImage ? '1of2' : null, md: '1of3', lg: '1of4' }}>
          {#each slice.items as item}
            <GridCell>
              <div class="u-sizeFull">
                <Html>
                  {#if item.image.url}
                    {@const sources = srcset(
                      item.image.url,
                      [200, 400, [800, 'q_50']],
                      { aspect: 4 / 3 }
                    )}
                    <img
                      sizes="13em"
                      srcset={sources}
                      style="max-width: 10rem"
                      alt={item.image.alt || ''}
                      src={sources.split(' ')[0]}
                      width="200"
                      height={200 * (4 / 3)} />
                  {:else if hasImage}
                    <img
                      alt=""
                      width="200"
                      height={200 * (4 / 3)}
                      style="max-width: 10rem; background-color: {data.page.data
                        .theme || 'rgb(--color-gray-dark)'};" />
                  {/if}
                  {#if item.label}
                    <strong class="label u-nudgeMd">{item.label}</strong>
                  {/if}
                  <div class:u-nudgeMd={!item.label}>
                    <RichText content={item.text} />
                  </div>
                </Html>
              </div>
            </GridCell>
          {/each}
        </Grid>
      </section>
    {/each}
  {/if}
{/if}

{#if shows?.length}
  <section
    id="tickets"
    class="u-spaceLg u-narrow u-container"
    bind:this={tickets}>
    <hr />
    <Grid class="u-spaceMd" slim appear size={{ md: '1of2', xl: '1of3' }}>
      {@const subset = shows.slice(
        0,
        showAll ? shows.length : INITAIL_TICKET_COUNT
      )}
      {#each subset as show, index (show.id)}
        <GridCell delay={`${(index - 3) * 150}ms`}>
          <div class="u-sizeFull">
            <Ticket
              name={show.name}
              href={show.shopUri}
              status={show.stockStatus}
              location={show.venue.name}
              date={parseJSON(show.start)} />
          </div>
        </GridCell>
      {/each}
    </Grid>
    {#if !showAll && shows.length > INITAIL_TICKET_COUNT}
      <ShowMore
        href={new URL('?showAll#tickets', $page.url)}
        on:click={onShowAll}>
        Visa fler
      </ShowMore>
    {/if}
  </section>
{/if}

{#if data.resources?.length}
  <div class="u-container">
    <hr />
    {#each data.resources as resources, index}
      {#if index}
        <hr style="border: 2px solid; margin: 2rem 0;" />
      {/if}
      <Html>
        <h2>Är du pedagog?</h2>
        <RichText content={resources.primary.description}>
          <p>
            Det pedagogiska materialet har tagits fram av Unga Klaras pedagoger
            och är till för er som har sett eller ska se föreställningen med er
            grupp och vill arbeta vidare kring delar av pjäsens tematik
            tillsammans.
          </p>
        </RichText>
      </Html>
      <Grid class="u-spaceSm" size={{ sm: '1of2', md: '1of3', lg: '1of4' }}>
        {#each resources.items as item}
          <GridCell>
            <Card
              size="small"
              title={item.name}
              image={resourceImage(item.image) ||
                resourceImage(data.page.data.poster)}
              color={data.page.data.theme}
              link={{ href: item.file.url, text: 'Ladda ner' }} />
          </GridCell>
        {/each}
      </Grid>
    {/each}
  </div>
{/if}
