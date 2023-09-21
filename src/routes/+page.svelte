<script>
  import { asText } from '@prismicio/client'
  import { enhance } from '$app/forms'

  import { intersection } from '$lib/utils/intersection.js'
  import SchoolBooking from '$lib/SchoolBooking.svelte'
  import Blockquote from '$lib/Blockquote.svelte'
  import { srcset } from '$lib/utils/srcset.js'
  import Instagram from '$lib/Instagram.svelte'
  import RichText from '$lib/RichText.svelte'
  import GridCell from '$lib/GridCell.svelte'
  import Calendar from '$lib/Calendar.svelte'
  import { track } from '$lib/utils/track.js'
  import { resolve } from '$lib/prismic.js'
  import Byline from '$lib/Byline.svelte'
  import Button from '$lib/Button.svelte'
  import Signup from '$lib/Signup.svelte'
  import Embed from '$lib/Embed.svelte'
  import Intro from '$lib/Intro.svelte'
  import Html from '$lib/Html.svelte'
  import Grid from '$lib/Grid.svelte'
  import Card from '$lib/Card.svelte'

  export let data
  export let form

  $: parent = data.page.data.parent
  $: parentHref = resolve(parent)

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

  const tracker = (event, items) => () => {
    track(event, { items: Array.isArray(items) ? items : [items] })
  }

  function blurbAsItem(slice) {
    switch (slice.slice_type) {
      case 'link_blurb':
        return {
          item_id: resolve(slice.primary.link),
          item_name: asText(slice.primary.link.data.title),
          item_category: 'Intern länk'
        }
      case 'file_blurb':
        return {
          item_id: slice.primary.file.url,
          item_name: asText(slice.primary.title),
          item_category: 'Länk till dokument eller bild'
        }
      case 'any_blurb':
        return {
          item_id: resolve(slice.primary.link),
          item_name: asText(slice.primary.title),
          item_category: 'Extern länk'
        }
      default:
        return null
    }
  }

  function image(props) {
    if (!props.url) return null
    return {
      srcset: srcset(props.url, [200, 400, 600, 900, [1600, 'q_80']]),
      sizes: '(min-width: 600px) 50vw, 100vw',
      alt: props.alt || '',
      src: srcset(props.url, [[900, 'c_thumb']]).split(' ')[0],
      ...props.dimensions
    }
  }
</script>

<div class="u-container">
  <div>
    {#if !data.page.data.hide_intro}
      <header>
        <Intro title={asText(data.page.data.title)}>
          <span slot="badge">
            {#if parentHref}
              <a href={parentHref}>
                ← {parent.data.shortname?.length
                  ? asText(parent.data.shortname)
                  : asText(parent.data.title)}
              </a>
            {:else if data.page.data.shortname?.length}
              {asText(data.page.data.shortname)}
            {/if}
          </span>
          <RichText slot="text" content={data.page.data.description} />
        </Intro>
      </header>
    {/if}

    {#each slices as slice}
      <div class="slice slice-{slice.slice_type}">
        {#if slice.slice_type === '__blurbs'}
          <div
            use:intersection={tracker(
              'view_item_list',
              slice.items.map(blurbAsItem)
            )}>
            <Grid size={{ md: '1of2', lg: '1of3' }}>
              {#each slice.items as item}
                {#if item.slice_type === 'link_blurb'}
                  {@const href = resolve(item.primary.link) }
                  {#if href}
                    <GridCell>
                      <Card
                        on:click={tracker('select_item', blurbAsItem(item))}
                        title={asText(item.primary.link.data.title)}
                        image={image(item.primary.link.data.featured_image)}
                        color={item.primary.color ||
                          item.primary.link.data.theme}
                        link={{ href, text: item.primary.link.data.cta }}>
                        <RichText
                          content={item.primary.link.data.description} />
                      </Card>
                    </GridCell>
                  {/if}
                {/if}

                {#if item.slice_type === 'file_blurb'}
                  {#if item.primary.file.url}
                    <GridCell>
                      <Card
                        on:click={tracker('select_item', blurbAsItem(item))}
                        title={asText(item.primary.title)}
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
                        on:click={tracker('select_item', blurbAsItem(item))}
                        title={asText(item.primary.title)}
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
          </div>
        {/if}

        {#if slice.slice_type === 'text'}
          {#if asText(slice.primary.text) || slice.items.length}
            <div>
              {#if slice.primary.text.length}
                <Html size="large">
                  <RichText content={slice.primary.text} />
                </Html>
              {/if}
              {#if slice.items.length}
                {@const size =
                  slice.items.length > 2
                    ? { md: '1of2', lg: '1of3' }
                    : { md: '1of2' }}
                <Grid {size} class="u-spaceMd">
                  {#each slice.items as item}
                    <GridCell>
                      <Html size="large">
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
            {#if slice.primary.divider}
              <div class="u-divider u-spaceLg" />
            {/if}
            <Html
              size="large"
              class={slice.primary.divider ? 'u-spaceSm' : 'u-spaceLg'}>
              <h2>{heading}</h2>
              <RichText content={slice.primary.text} />
            </Html>
          {/if}
        {/if}

        {#if slice.slice_type === 'quote'}
          <div class="u-spaceLg">
            <Blockquote>
              <div slot="text"><RichText content={slice.primary.text} /></div>
              <div slot="cite"><RichText content={slice.primary.cite} /></div>
            </Blockquote>
          </div>
        {/if}

        {#if slice.slice_type === 'image'}
          {#if slice.primary.image.url}
            {@const sources = srcset(slice.primary.image.url, [
              400,
              600,
              900,
              [1600, 'q_80'],
              [3000, 'q_60']
            ])}
            <figure>
              <Html
                size="large"
                class={slice.primary.smaller ? '' : 'u-sizeFull'}>
                <img
                  sizes="100vw"
                  srcset={sources}
                  src={sources.split(' ')[0]}
                  alt={slice.primary.image.alt || ''}
                  {...slice.primary.image.dimensions} />
                {#if slice.primary.image.copyright}
                  <figcaption>
                    <small class="muted">{slice.primary.image.copyright}</small>
                  </figcaption>
                {/if}
              </Html>
            </figure>
          {/if}
        {/if}

        {#if slice.slice_type === 'video'}
          {@const items = slice.items.filter((item) => item.video.embed_url)}
          {#if slice.primary.video.embed_url}
            <Embed content={slice.primary.video} />
          {/if}
          {#if items.length}
            <div class="u-spaceMd u-md-uncontain">
              <Grid
                carousel
                size={{ md: `1of${items.length - 1 < 3 ? 2 : 3}` }}>
                {#each items as item}
                  <GridCell>
                    <Embed content={item.video} />
                  </GridCell>
                {/each}
              </Grid>
            </div>
          {/if}
        {/if}

        {#if slice.slice_type === 'author' || slice.slice_type === 'contact'}
          <Byline
            heading={asText(slice.primary.heading)}
            image={slice.primary.image.url
              ? Object.assign(
                  {
                    src: srcset(slice.primary.image.url, [200], {
                      aspect: 278 / 195
                    }).split(' ')[0],
                    sizes: '15rem',
                    srcset: srcset(
                      slice.primary.image.url,
                      [200, 400, [800, 'q_80']],
                      {
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
        {/if}

        {#if slice.slice_type === 'accordion'}
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
        {/if}

        {#if slice.slice_type === 'team'}
          {#if slice.items.length}
            <Grid
              size={{
                lg: '1of4',
                md: '1of2',
                xs: slice.items.find((item) => item.image.url) ? '1of2' : '1of1'
              }}>
              {#each slice.items as item}
                <GridCell>
                  <article>
                    <Html>
                      {#if item.image.url}
                        {@const sources = srcset(item.image.url, [
                          200,
                          400,
                          [800, 'q_80']
                        ], { aspect: 1.4 })}
                        <img
                          class="u-sizeFull"
                          sizes="13em"
                          srcset={sources}
                          style="max-width: 13em !important; width: 100%"
                          alt={item.image.alt || ''}
                          src={sources.split(' ')[0]}
                          {...item.image.dimensions} />
                      {/if}
                      <div class="u-nudgeMd">
                        {#if item.label}
                          <strong class="u-textLabel">{item.label}</strong>
                        {/if}
                        <RichText content={item.text} />
                      </div>
                    </Html>
                  </article>
                </GridCell>
              {/each}
            </Grid>
          {/if}
        {/if}

        {#if slice.slice_type === 'button'}
          {#if slice.primary.text && slice.primary.link}
            <Button primary href={resolve(slice.primary.link)}>
              {slice.primary.text}
            </Button>
          {/if}
        {/if}

        {#if slice.slice_type === 'signup'}
          <Signup result={form?.signup}>
            <div slot="primary">
              <Html size="large">
                <h2 class="h1">{asText(data.settings.data.signup_heading)}</h2>
                <RichText content={data.settings.data.signup_content} />
              </Html>
            </div>
            <div slot="success">
              <Html>
                <RichText content={data.settings.data.signup_success} />
              </Html>
            </div>
          </Signup>
        {/if}

        {#if slice.slice_type === 'resources'}
          {@const heading = asText(slice.primary.heading)}
          <hr
            style="margin: 2.5rem 0;"
            use:intersection={tracker(
              'view_item_list',
              slice.items.map((item) => ({
                item_list_name: heading,
                item_id: item.file.url,
                item_name: item.name,
                item_category: 'Pedagogiskt material'
              }))
            )} />
          {#if heading || asText(slice.primary.description)}
            <Html>
              <h2>{heading}</h2>
              <RichText content={slice.primary.description} />
            </Html>
          {/if}
          <Grid class="u-spaceMd" size={{ sm: '1of2', md: '1of2', lg: '1of3', xl: '1of4' }}>
            {#each slice.items as item}
              <GridCell>
                <Card
                  on:click={tracker('select_item', {
                    item_list_name: heading,
                    item_id: item.file.url,
                    item_name: item.name,
                    item_category: 'Pedagogiskt material'
                  })}
                  size="small"
                  title={item.name}
                  image={image(item.image) ||
                    image(slice.primary.event?.data?.poster)}
                  square
                  color={slice.primary.event?.data.theme}
                  link={{ href: item.file.url, text: 'Ladda ner' }} />
              </GridCell>
            {/each}
          </Grid>
        {/if}

        {#if slice.slice_type === 'school_booking_form'}
          {@const hasBody = Boolean(asText(slice.primary.text))}
          <form class="u-spaceLg" action="?/booking" method="POST" use:enhance>
            <SchoolBooking result={form?.booking}>
              {#if hasBody}
                <Html>
                  <RichText content={slice.primary.text} />
                </Html>
              {/if}
            </SchoolBooking>
          </form>
        {/if}

        {#if slice.slice_type === 'upcoming_shows'}
          {@const events = data[slice.id]}
          {@const text = asText(slice.primary.text)}
          {#if events}
            <div class="u-spaceLg">
              <Html>
                <RichText content={slice.primary.text} />
              </Html>
              <div class:u-spaceMd={text}>
                <Calendar compact {events} limit={6} />
              </div>
            </div>
          {/if}
        {/if}

        {#if slice.slice_type === 'instagram-bilder'}
          {@const posts = slice.items}
          {@const text = asText(slice.primary.heading)}
          {#if posts}
            <div class="u-spaceLg">
              <Html>
                <RichText content={slice.primary.heading} />
              </Html>
              <div class:u-spaceMd={text}>
                <Instagram {posts} />
              </div>
            </div>
          {/if}
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .slice {
    position: relative;
    margin-top: var(--space-md);
  }

  .slice-signup {
    margin-top: var(--space-lg);
  }

  .slice-heading + .slice-button {
    margin-top: var(--space-sm);
  }

  .slice-text + .slice-author,
  .slice-button + .slice-author {
    margin-top: var(--space-lg);
  }
</style>
