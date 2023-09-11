<script>
  import { asText } from '@prismicio/client'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import resolve from '$lib/utils/resolve.js'
  import GridCell from '$lib/GridCell.svelte'
  import RichText from '$lib/RichText.svelte'
  import srcset from '$lib/utils/srcset.js'
  import track from '$lib/utils/track.js'
  import Grid from '$lib/Grid.svelte'
  import Html from '$lib/Html.svelte'
  import Card from '$lib/Card.svelte'
  import Scen from '../+page.svelte'

  export let data

  $: tag = $page.url.searchParams.get('tag')
  $: period = $page.url.searchParams.get('period')

  const onclick = (event) => () => {
    track('select_item', {
      item_list_name: 'Produktioner',
      items: [
        {
          item_id: event.id,
          item_name: asText(event.data.title),
          item_category: 'Produktion'
        }
      ]
    })
  }

  onMount(function () {
    track('view_item_list', {
      item_list_name: 'Arkiv',
      items: data.events.map((event) => ({
        item_id: event.id,
        item_name: asText(event.data.title),
        item_category: 'Produktion'
      }))
    })
  })

  function image(props) {
    if (!props.url) return null
    const sources = srcset(props.url, [400, 600, [900, 'q_50']], {
      aspect: 1
    })
    return {
      srcset: sources,
      sizes: '(min-width: 600px) 33vw, 100vw',
      alt: props.alt || '',
      src: sources.split(' ')[0],
      width: props.dimensions.width,
      height: props.dimensions.width
    }
  }
</script>

<Scen {data} {period} {tag} tab="arkiv">
  <Grid ordered appear size={{ xs: '1of2', md: '1of3', lg: '1of4' }}>
    {#each data.events as event}
      <GridCell>
        <Card
          shrink
          clamp={4}
          on:click={onclick(event)}
          title={asText(event.data.title)}
          image={image(event.data.poster)}
          link={{ href: resolve(event), text: event.data.cta || 'Läs mer' }}>
          <Html>
            <RichText content={event.data.description} />
          </Html>
        </Card>
      </GridCell>
    {/each}
  </Grid>
</Scen>
