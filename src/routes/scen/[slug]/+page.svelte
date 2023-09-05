<script>
  import Button from '$lib/Button.svelte'
  import Intro from '$lib/Intro.svelte'

  export let data
</script>

<div class="u-container">
  <Intro blurb title="Vill du se fler föreställningar?">
    <Button slot="action" primary href="/scen" icon="arrow">
      Aktuellt på scen
    </Button>
  </Intro>
</div>
