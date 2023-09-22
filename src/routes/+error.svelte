<script>
  import { page } from '$app/stores'

  import Intro from '$lib/Intro.svelte'
  import Html from '$lib/Html.svelte'
</script>

<div class="u-container">
  <div class="pull">
    <Intro title="Något gick fel :(">
      <Html size="large" slot="text">
        {#if $page.status === 404}
          <p>
            Här var det visst tomt. Prova att hitta rätt från <a href="/">
              startsidan
            </a>
            eller via menyn här uppe.
          </p>
        {:else}
          <p>
            Något blev visst tokigt här. Det kan vara bara tillfälligt, prova
            att <a href={$page.url.pathname}>försöka igen</a>
            eller gå tillbaka till
            <a href="/">startsidan</a>
          </p>
        {/if}
      </Html>
    </Intro>
    <img
      class="image"
      src="https://images.prismic.io/unga-klara/c742ae78a18a094bc57090ba1ccb6851667dca02_img-5715-mindre-sara-p-borgstrom.jpg?auto=compress,format"
      alt=""
      width="4319"
      height="6109" />
  </div>
</div>

<style>
  .pull {
    position: relative;
  }

  .pull :global(.intro) {
    padding-top: 10vw;
    margin: 0 0 3rem;
  }

  img {
    height: auto;
    width: 80%;
    max-width: 25rem;
    transform: rotate(5deg);
  }

  @media (min-width: 1100px) {
    img {
      position: absolute;
      right: 0;
      top: 8rem;
    }
  }
</style>
