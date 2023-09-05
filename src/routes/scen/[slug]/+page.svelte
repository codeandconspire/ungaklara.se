<script>
  import { asText } from '@prismicio/client'

  import resolve from '$lib/utils/resolve.js'
  import RichText from '$lib/RichText.svelte'
  import srcset from '$lib/utils/srcset.js'
  import Button from '$lib/Button.svelte'
  import Intro from '$lib/Intro.svelte'
  import Event from '$lib/Event.svelte'

  export let data

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
        href: resolve(data.page.data.buy_link.url),
        primary: true,
        icon: 'arrow',
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    ]}
    image={data.page.data.poster.url ? data.page.data.poster : null}>
    <RichText content={data.page.data.about} />
  </Event>
  <Intro blurb title="Vill du se fler föreställningar?">
    <Button slot="action" primary href="/scen" icon="arrow">
      Aktuellt på scen
    </Button>
  </Intro>
</div>
