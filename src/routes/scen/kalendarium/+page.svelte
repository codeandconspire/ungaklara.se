<script>
  import Calendar from '$lib/Calendar.svelte'
  import Scen from '../+page.svelte'

  export let data
</script>

{#if !data.events?.length}
  <Scen {data} tab="kalendarium" />
{:else}
  <Scen {data} tab="kalendarium">
    <div class="u-spaceLg">
      <Calendar events={data.events} />
    </div>
  </Scen>
{/if}
