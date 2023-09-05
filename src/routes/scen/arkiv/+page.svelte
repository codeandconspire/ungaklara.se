<script>
  import { asText } from '@prismicio/client'
  import { fly } from 'svelte/transition'
  import { page } from '$app/stores'

  import resolve from '$lib/utils/resolve.js'
  import GridCell from '$lib/GridCell.svelte'
  import RichText from '$lib/RichText.svelte'
  import srcset from '$lib/utils/srcset.js'
  import Grid from '$lib/Grid.svelte'
  import Html from '$lib/Html.svelte'
  import Card from '$lib/Card.svelte'
  import Scen from '../+page.svelte'

  export let data

  $: tag = $page.url.searchParams.get('tag')
  $: period = $page.url.searchParams.get('period')

  function image(props) {
    if (!props.url) return null
    const sources = srcset(props.url, [400, 600, [900, 'q_50']])
    return {
      srcset: sources,
      sizes: '(min-width: 600px) 33vw, 100vw',
      alt: props.alt || '',
      src: sources.split(' ')[0],
      ...props.dimensions
    }
  }
</script>

<Scen {data} {period} {tag} tab="arkiv">
  <Grid ordered size={{ xs: '1of2', md: '1of3', lg: '1of4' }}>
    {#each data.events as event}
      <GridCell>
        <div in:fly={{ y: 50, duration: 200 }}>
          <Card
            shrink
            clamp={4}
            title={asText(event.data.title)}
            image={image(event.data.poster)}
            link={{ href: resolve(event), text: event.data.cta || 'Läs mer' }}>
            <Html>
              <RichText content={event.data.description} />
            </Html>
          </Card>
        </div>
      </GridCell>
    {/each}
  </Grid>
</Scen>
