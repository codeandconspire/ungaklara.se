<script>
  import { asText } from '@prismicio/client'

  import resolve from '$lib/utils/resolve.js'
  import RichText from '$lib/RichText.svelte'
  import GridCell from '$lib/GridCell.svelte'
  import Blockquote from '$lib/Blockquote.svelte'
  import srcset from '$lib/utils/srcset.js'
  import Intro from '$lib/Intro.svelte'
  import Html from '$lib/Html.svelte'
  import Embed from '$lib/Embed.svelte'
  import Grid from '$lib/Grid.svelte'
  import Byline from '$lib/Byline.svelte'
  import Card from '$lib/Card.svelte'
  import Button from '$lib/Button.svelte'

  export let data

  $: slices = data.page.data.body.reduce(function (acc, slice) {
    switch (slice.slice_type) {
      case 'link_blurb':
      case 'file_blurb':
      case 'any_blurb': {
        const prev = acc.at(-1)
        if (prev?.slice_type === '__blurbs') prev.items.push(slice)
        else acc.push({ slice_type: '__blurbs', items: [slice] })
        return acc
      }
      default:
        return acc.concat(slice)
    }
  }, [])

  function image(props) {
    if (!props.url) return null
    return {
      srcset: srcset(props.url, [200, 400, 600, 900, [1600, 'q_60,c_thumb']], {
        transforms: 'c_thumb'
      }),
      sizes: '(min-width: 600px) 50vw, 100vw',
      alt: props.alt || '',
      src: srcset(props.url, [900, 'c_thumb']).split(' ')[0],
      ...props.dimensions
    }
  }

  $: parent = data.page.data.parent
  $: parentHref = resolve(parent)
</script>

<div class="u-container">
  <div>
    <header>
      <Intro title={asText(data.page.data.title)}>
        <span slot="badge">
          {#if parentHref}
            <a href={parentHref}>
              {parent.data.shortname?.length
                ? asText(parent.data.shortname)
                : asText(parent.data.title)}
            </a>
            :
          {/if}
        </span>
        <RichText slot="text" content={data.page.data.description} />
      </Intro>
    </header>

    {#each slices as slice}
      {#if slice.slice_type === '__blurbs'}
        <Grid size={{ md: '1of2', lg: '1of3' }}>
          {#each slice.items as item}
            {#if item.slice_type === 'link_blurb'}
              {@const href = resolve(item.primary.link)}
              {#if href}
                <GridCell>
                  <Card
                    title={asText(item.primary.link.data.title)}
                    image={image(item.primary.link.data.featured_image)}
                    color={item.primary.color || item.primary.link.data.theme}
                    link={{ href, text: item.primary.link.data.cta }}>
                    <RichText content={item.primary.link.data.description} />
                  </Card>
                </GridCell>
              {/if}
            {/if}

            {#if item.slice_type === 'file_blurb'}
              {#if item.primary.file.url}
                <GridCell>
                  <Card
                    title={item.primary.title}
                    image={image(item.primary.image)}
                    color={item.primary.color}
                    link={{ href: item.primary.file.url }}>
                    <RichText content={item.primary.text} />
                  </Card>
                </GridCell>
              {/if}
            {/if}

            {#if item.slice_type === 'any_blurb'}
              {@const href = resolve(item.primary.link)}
              {#if href}
                <GridCell>
                  <Card
                    title={item.primary.title}
                    image={image(item.primary.image)}
                    color={item.primary.color}
                    link={{ href }}>
                    <RichText content={item.primary.text} />
                  </Card>
                </GridCell>
              {/if}
            {/if}
          {/each}
        </Grid>
      {/if}

      {#if slice.slice_type === 'text'}
        {@const items = slice.items.filter((item) => item.text.length)}
        {#if slice.primary.text.length && !slice.primary.items.length}
          <div class="u-spaceV6">
            {#if slice.primary.text.length}
              <Html size="large">
                <RichText content={slice.primary.text} />
              </Html>
            {/if}
            {#if items.length}
              <Grid size={{ md: '1of2' }}>
                {#each items as item}
                  <GridCell>
                    <Html size="large" class="u-spaceB2">
                      <RichText content={item.text} />
                    </Html>
                  </GridCell>
                {/each}
              </Grid>
            {/if}
          </div>
        {/if}
      {/if}

      {#if slice.slice_type === 'heading'}
        {@const heading = asText(slice.primary.heading)}
        {#if heading}
          <Html size="large" class="u-spaceB5 u-pushDown">
            <h2>{heading}</h2>
            <RichText content={slice.primary.text} />
          </Html>
        {/if}
      {/if}

      {#if slice.slice_type === 'quote'}
        <div class="u-spaceV5">
          <Blockquote>
            <div slot="text"><RichText content={slice.primary.text} /></div>
            <div slot="cite"><RichText content={slice.primary.cite} /></div>
          </Blockquote>
        </div>
      {/if}

      {#if slice.slice_type === 'image'}
        <!-- if (!slice.primary.image.url) return null;
        const sources = srcset(slice.primary.image.url, [
          400,
          600,
          900,
          [1600, 'q_60'],
          [3000, 'q_50']
        ]);
        const attrs = Object.assign(
          {
            sizes: '100vw',
            srcset: sources,
            src: sources.split(' ')[0],
            alt: slice.primary.image.alt || ''
          },
          slice.primary.image.dimensions
        );
        return html`
          <figure class="Text Text--large ${slice.primary.smaller ? '' : 'u-sizeFull'} u-spaceV6">
            <img ${attrs} />
            ${slice.primary.image.copyright
              ? html`
                  <figcaption>
                    <small class="Text-muted">${slice.primary.image.copyright}</small>
                  </figcaption>
                `
              : null}
          </figure>
        `; -->
      {/if}

      {#if slice.slice_type === 'video'}
        {@const items = slice.items.filter((item) => item.video.embed_url)}
        <div class="u-spaceT7 u-posRelative">
          {#if slice.primary.video.embed_url}
            <Embed content={slice.primary.video} />
          {/if}
          {#if items.length}
            <div class="u-spaceT4 u-md-uncontain">
              <Grid carousel size={{ md: `1of${items.length - 1 < 3 ? 2 : 3}` }}>
                {#each items as item}
                  <GridCell>
                    <Embed content={item.video} />
                  </GridCell>
                {/each}
              </Grid>
            </div>
          {/if}
        </div>
      {/if}

      {#if slice.slice_type === 'author'}
        <div class="u-spaceV7">
          <Byline
            heading={asText(slice.primary.heading)}
            image={slice.primary.image.url
              ? Object.assign(
                  {
                    src: srcset(slice.primary.image.url, [200, 'c_thumb'], {
                      aspect: 278 / 195
                    }).split(' ')[0],
                    sizes: '15rem',
                    srcset: srcset(
                      slice.primary.image.url,
                      [200, 400, [800, 'q_50,c_thumb']],
                      {
                        transforms: 'c_thumb',
                        aspect: 278 / 195
                      }
                    ),
                    alt: slice.primary.image.alt || ''
                  },
                  slice.primary.image.dimensions
                )
              : null}>
            <RichText content={slice.primary.text} />
          </Byline>
        </div>
      {/if}

      {#if slice.slice_type === 'accordion'}
        <section class="u-spaceV6">
          <div class="Text u-sizeFull">
            {#each slice.items as item}
              {#if item.heading.length && item.text}
                <Html size="large" class="u-sizeFull">
                  <details>
                    <summary><h3>{asText(item.heading)}</h3></summary>
                    <RichText content={item.text} />
                  </details>
                </Html>
              {/if}
            {/each}
          </div>
        </section>
      {/if}

      {#if slice.slice_type === 'team'}
        {#if slice.items.length}
          <div class="u-spaceV7">
            <Grid size={{ lg: '1of4', md: '1of2', xs: slice.items.find((item) => item.image.url) ? '1of2' : '1of1' }}>
              {#each slice.items as item}
                <GridCell>
                  <article>
                    <Html>
                      {#if item.image.url}
                        {@const sources = srcset(item.image.url, [200, 400, [800, 'q_50']])}
                        <img
                            class="u-spaceB2"
                            sizes="13em"
                            srcset={sources}
                            style="max-width: 13em"
                            alt={item.image.alt || ''}
                            src={sources.split(' ')[0]}
                            {...item.image.dimensions} />
                      {/if}
                      {#if item.label}
                        <strong class="label">{item.label}</strong>
                      {/if}
                      <RichText content={item.text} />
                    </Html>
                  </article>
                </GridCell>
              {/each}
            </Grid>
          </div>
        {/if}
      {/if}

      {#if slice.slice_type === 'button'}
        {#if slice.primary.text && slice.primary.link}
          <div class="u-spaceV7">
            <Button primary href={resolve(slice.primary.link)}>
              {slice.primary.text}
            </Button>
          </div>
        {/if}
      {/if}
    {/each}
  </div>
</div>
