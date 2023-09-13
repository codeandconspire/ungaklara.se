<script>
  import { asText } from '@prismicio/client'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  import Blockquote from '$lib/Blockquote.svelte'
  import resolve from '$lib/utils/resolve.js'
  import FactsBox from '$lib/FactsBox.svelte'
  import RichText from '$lib/RichText.svelte'
  import GridCell from '$lib/GridCell.svelte'
  import Hashtag from '$lib/Hashtag.svelte'
  import Spotify from '$lib/Spotify.svelte'
  import Masonry from '$lib/Masonry.svelte'
  import Trailer from '$lib/Trailer.svelte'
  import srcset from '$lib/utils/srcset.js'
  import Button from '$lib/Button.svelte'
  import Intro from '$lib/Intro.svelte'
  import Embed from '$lib/Embed.svelte'
  import Event from '$lib/Event.svelte'
  import Html from '$lib/Html.svelte'
  import Grid from '$lib/Grid.svelte'

  export let data

  $: videos = data.page.data.videos.filter((group) => group.video.embed_url)

  const ontoggle = (event) =>
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })

  const small = browser ? window.matchMedia('(min-width: 600px)') : null
  const medium = browser ? window.matchMedia('(min-width: 800px)') : null
  const large = browser ? window.matchMedia('(min-width: 1000px)') : null

  let isSmall = false
  let isMedium = false
  let isLarge = false

  onMount(measure)

  function measure() {
    isSmall = Boolean(small?.matches)
    isMedium = Boolean(medium?.matches)
    isLarge = Boolean(large?.matches)
  }

  function image(props) {
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
</script>

<svelte:window on:resize={measure} />

<div class="u-container">
  <header>
    <Intro
      title={asText(data.page.data.title)}
      image={image(data.page.data.image)}>
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

  <Event
    buttons={[
      {
        href: '#program',
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
    ]}
    image={data.page.data.poster.url ? data.page.data.poster : null}>
    <RichText content={data.page.data.about} />
  </Event>

  <div class="u-spaceLg">
    <FactsBox items={data.page.data.details} />
  </div>

  {#if !isSmall}
    {#if videos.length}
      <div class="u-spaceLg u-posRelative">
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
      <div class="u-spaceMd">
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

    {@const images = data.page.data.media.filter(
      (slice) => slice.slice_type === 'image' && slice.primary.image.url
    )}
    {@const quotes = data.page.data.media.filter(
      (slice) => slice.slice_type === 'quote' && slice.primary.text.length
    )}
    {@const team = data.page.data.team.filter(
      (slice) =>
        slice.slice_type === 'group' &&
        slice.primary.heading.length &&
        slice.items.length
    )}
    {#if images.length || quotes.length || team.length}
      <Html class="u-spaceMd">
        {#if images.length}
          <details on:toggle={ontoggle}>
            <summary>Bilder</summary>
            <Grid carousel>
              {#each images as slice}
                {@const { dimensions, url, alt = '' } = slice.primary.image}
                {@const sources = srcset(url, [400, 599, 900, [1500, 'q_60']])}
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
            <Grid
              size={{ xs: hasImage ? '1of2' : null, md: '1of3', lg: '1of4' }}>
              {#each slice.items as item}
                <GridCell>
                  <article>
                    <Html>
                      {#if item.image.url}
                        {@const sources = srcset(item.image.url, [
                          200,
                          400,
                          [800, 'q_50']
                        ])}
                        <img
                          sizes="13em"
                          srcset={sources}
                          style="max-width: 13em; width: 100%"
                          alt={item.image.alt || ''}
                          src={sources.split(' ')[0]}
                          {...item.image.dimensions} />
                      {/if}
                      {#if item.label}
                        <strong class="u-textLabel u-nudgeMd">{item.label}</strong>
                      {/if}
                      <RichText content={item.text} />
                    </Html>
                  </article>
                </GridCell>
              {/each}
            </Grid>
          </details>
        {/each}
      </Html>
    {/if}
  {:else}
    <div class="u-spaceMd">
      <Masonry
        let:item={slice}
        gap={isLarge ? 24 : isMedium ? 32 : 24}
        items={data.page.data.media.map((slice, index) => ({
          id: `${slice.slice_type}-${index}`,
          ...slice
        }))}>
        {#if slice.slice_type === 'image'}
          {@const { dimensions, url, alt = '' } = slice.primary.image}
          {@const sources = srcset(url, [400, 599, 900, [1500, 'q_60']])}
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
              {@const external =
                data.page.data.hashtag_link.target === '_blank'}
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

    {@const team = data.page.data.team.filter(
      (slice) =>
        slice.slice_type === 'group' &&
        slice.primary.heading.length &&
        slice.items.length
    )}
    {#if team.length}
      {#each team as slice}
        {@const hasImage = slice.items.some((item) => item.image.url)}
        <section class="u-spaceLg">
          <Html>
            <h2>{asText(slice.primary.heading)}</h2>
          </Html>
          <Grid
            class="u-spaceSm"
            size={{ xs: hasImage ? '1of2' : null, md: '1of3', lg: '1of4' }}>
            {#each slice.items as item}
              <GridCell>
                <article>
                  <Html size="small" fixed>
                    {#if item.image.url}
                      {@const sources = srcset(item.image.url, [
                        200,
                        400,
                        [800, 'q_50']
                      ])}
                      <img
                        sizes="13em"
                        srcset={sources}
                        style="max-width: 13em; width: 100%"
                        alt={item.image.alt || ''}
                        src={sources.split(' ')[0]}
                        {...item.image.dimensions} />
                    {/if}
                    {#if item.label}
                      <strong class="u-textLabel u-nudgeMd">{item.label}</strong>
                    {/if}
                    <RichText content={item.text} />
                  </Html>
                </article>
              </GridCell>
            {/each}
          </Grid>
        </section>
      {/each}
    {/if}
  {/if}

  {#if data.page.data.resource_heading.length}
    {@const blurb = data.page.data.resource_blurb}
    {@const blurbHref = resolve(blurb)}
    {@const resourceHref = resolve(data.page.data.resource_link)}
    <hr />
    {#if blurbHref}
      <Grid>
        <GridCell size={{ md: '1of2', lg: '2of3' }}>
          <Html large>
            <h2>{asText(data.page.data.resource_heading)}</h2>
            <RichText content={data.page.data.resource_text} />
          </Html>
          {#if resourceHref}
            <Button class="u-spaceSm" icon="download" href={resourceHref}>
              {data.page.data.resource_link_text || 'Ladda ner'}
            </Button>
          {/if}
        </GridCell>
        <GridCell size={{ md: '1of2', lg: '1of3' }}>
          <div class="u-bgGrayLight">
            <Html class="u-paddedBox">
              <p class="fat large">
                {'Lorem ipsum' || asText(blurb.data.description)}
              </p>
              <strong>
                <a href="${blurbHref}">
                  {'Hej' || blurb.data.cta || 'Läs mer'}
                </a>
              </strong>
            </Html>
          </div>
        </GridCell>
      </Grid>
    {:else}
      <Html large>
        <h2>{asText(data.page.data.resource_heading)}</h2>
        <RichText content={data.page.data.resource_text} />
      </Html>
      {#if resourceHref}
        <Button class="u-spaceSm" icon="download" href={resourceHref}>
          {data.page.data.resource_link_text || 'Ladda ner'}
        </Button>
      {/if}
    {/if}
  {/if}
</div>
