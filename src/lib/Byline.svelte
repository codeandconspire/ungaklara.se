<script>
  import Html from './Html.svelte'
  import Framed from './Framed.svelte'

  export let heading = undefined
  export let image = {}
</script>

<div class="byline">
  {#if image}
    <figure class="image">
      <Framed format="ellipse" {...image} />
    </figure>
  {/if}
  <div class="body">
    <Html>
      <h3 class="u-nudgeMd">{heading}</h3>
      <slot />
    </Html>
  </div>
</div>

<style>
  .byline {
    display: flex;
    margin-left: -0.2rem;
  }

  .image {
    max-width: 11rem;
    margin-right: 1rem;
  }

  .body {
    max-width: 34rem;
    text-wrap: balance;
  }

  @media (min-width: 400px) {
    .byline {
      align-items: center;
      margin-left: -0.5rem;
    }

    .body {
      position: relative;
      top: -0.5rem;
    }

    .image {
      margin-right: 2rem;
    }
  }

  @media (min-width: 1000px) {
    .image {
      max-width: 15rem;
      margin-right: 3rem;
    }
  }

</style>
