<script>
  import { asText } from '@prismicio/client'

  import resolve from '$lib/utils/resolve.js'
  import RichText from '$lib/RichText.svelte'
  import GridCell from '$lib/GridCell.svelte'
  import srcset from '$lib/utils/srcset.js'
  import Intro from '$lib/Intro.svelte'
  import Html from '$lib/Html.svelte'
  import Grid from '$lib/Grid.svelte'
  import Card from '$lib/Card.svelte'

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
              <Html size="lg">
                <RichText content={slice.primary.text} />
              </Html>
            {/if}
            {#if items.length}
              <Grid size={{ md: '1of2' }}>
                {#each items as item}
                  <GridCell>
                    <Html size="lg" class="u-spaceB2">
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
          <Html size="lg" class="u-spaceB5 u-pushDown">
            <h2>{heading}</h2>
            <RichText content={slice.primary.text} />
          </Html>
        {/if}
      {/if}

      {#if slice.slice_type === 'quote'}
        <!-- const blockquote = state.cache(Blockquote, `${state.params.slug}-${index}`);
        return html`
          <div class="u-spaceV5">
            ${blockquote.render({
              large: true,
              content: asElement(slice.primary.text, resolve, serialize),
              caption: asElement(slice.primary.cite, resolve, serialize)
            })}
          </div>
        `; -->
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
        <!-- const items = slice.items.filter((item) => item.video.embed_url);
        return html`
          <div class="u-spaceT7">
            ${slice.primary.video.embed_url
              ? video(slice.primary.video, {
                  large: true
                })
              : null}
            ${items.length
              ? html`
                  <div class="u-md-uncontain u-spaceT6">
                    ${grid(
                      {
                        carousel: true,
                        size: {
                          md: `1of${items.length % 3 ? 2 : 3}`
                        }
                      },
                      items.map((item) => video(item.video))
                    )}
                  </div>
                `
              : null}
          </div>
        `; -->
      {/if}

      {#if slice.slice_type === 'author'}
        <!-- return html`
          <div class="u-spaceV6">
            ${byline({
              heading: asText(slice.primary.heading),
              body: asElement(slice.primary.text, resolve, reset),
              image: slice.primary.image.url
                ? Object.assign(
                    {
                      src: srcset(slice.primary.image.url, [200, 'c_thumb'], {
                        aspect: 278 / 195
                      }).split(' ')[0],
                      sizes: '15rem',
                      srcset: srcset(slice.primary.image.url, [200, 400, [800, 'q_50,c_thumb']], {
                        transforms: 'c_thumb',
                        aspect: 278 / 195
                      }),
                      alt: slice.primary.image.alt || ''
                    },
                    slice.primary.image.dimensions
                  )
                : null
            })}
          </div>
        `; -->
      {/if}

      {#if slice.slice_type === 'accordion'}
        <!-- return html`
          <section class="u-spaceV6">
            <div class="Text u-sizeFull">
              ${slice.items
                .map(function (item) {
                  if (!item.heading.length) return null;
                  return html`
                    <details>
                      <summary><h3>${asText(item.heading)}</h3></summary>
                      <div class="Text Text--large">${asElement(item.text)}</div>
                    </details>
                  `;
                })
                .filter(Boolean)}
            </div>
          </section>
        `; -->
      {/if}

      {#if slice.slice_type === 'team'}
        <!-- if (!slice.items.length) return;
        const opts = { size: { lg: '1of4' } };
        const hasImage = slice.items.find((item) => item.image.url);
        if (hasImage) opts.size.xs = '1of2';
        else opts.size.md = '1of2';
        return grid(opts, slice.items.map(teamMember)); -->
      {/if}

      {#if slice.slice_type === 'newsletter'}
        <!-- return html`
          <div>
            ${index !== 0 ? html`<hr class="u-invisible" />` : null}
            ${state.cache(Subscribe, `${state.params.slug}-${index}`).render({
              action: state.newsletter,
              title: asText(slice.primary.heading),
              body:
                slice.primary.text && slice.primary.text.length
                  ? asElement(slice.primary.text, resolve, serialize)
                  : null,
              success:
                slice.primary.success_message && slice.primary.success_message.length
                  ? asElement(slice.primary.success_message, resolve, serialize)
                  : null
            })}
            ${index < list.length - 1 ? html`<hr />` : null}
          </div>
        `; -->
      {/if}

      {#if slice.slice_type === 'button'}
        <!-- if (!slice.primary.text && !slice.primary.link) return;
        return html`
          <div class="u-spaceV5">
            ${button({
              primary: true,
              external: slice.primary.link.link_type === 'Web',
              href: resolve(slice.primary.link),
              text: slice.primary.text
            })}
          </div>
        `; -->
      {/if}
    {/each}
  </div>
</div>
