<script>
  import { page } from '$app/stores'

  import Intro from '$lib/Intro.svelte'
  import Html from '$lib/Html.svelte'
</script>

<div class="u-container">
  <div class="u-spaceB8">
    <Intro title="Hoppsan!">
      <Html slot="text">
        <p>
          {#if $page.status === 404}
            Här var det visst tomt. Prova att hitta rätt via menyn eller från <a
              href="/">
              startsidan
            </a>
            .
          {:else}
            Nu gick något galet. Det kan vara bara tillfälligt, prova att <a
              href={$page.url.pathname}>
              försöka igen
            </a>
            eller gå tillbaka till
            <a href="/">startsidan</a>
            .
          {/if}
        </p>
      </Html>
    </Intro>
  </div>
</div>
