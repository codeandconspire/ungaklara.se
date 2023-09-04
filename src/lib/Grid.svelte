<script context="module">
  export let GRID = Symbol('GRID')
</script>

<script>
  import { setContext } from 'svelte'

  export let size = {}
  export let slim = false
  export let appear = false
  export let ordered = false
  export let carousel = false

  $: setContext(GRID, { size, ordered, appear, carousel })
</script>

{#if ordered}
  <ol class="grid" class:slim class:carousel>
    <slot />
  </ol>
{:else}
  <div class="grid" class:slim class:carousel>
    <slot />
  </div>
{/if}

<style>
  :root {
    --Grid-gutter: 1.5rem;
  }

  @media (min-width: 1000px), print {
    :root {
      --Grid-gutter: 2rem;
    }
  }

  @media (min-width: 1200px), print {
    :root {
      --Grid-gutter: 2.5rem;
    }
  }

  /* @define Grid */
  .grid {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + var(--Grid-gutter));
    margin: 0 calc(var(--Grid-gutter) * -0.5);
    margin-bottom: calc(var(--Grid-gutter) * -1);
  }

  .slim {
    --Grid-gutter: 1.25rem;
  }

  @media (min-width: 600px), print {
    .slim {
      --Grid-gutter: 1.375rem;
    }
  }

  @media (min-width: 1200px), print {
    .slim {
      --Grid-gutter: 1.5rem;
    }
  }

  /**
 * Carousel
 */

  @media (max-width: 599px) {
    .carousel {
      width: 100%;
      margin: 0;
      overflow-x: auto;
      overflow-y: hidden;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
      -webkit-scroll-snap-type: mandatory;
      scroll-snap-type: x mandatory;
      -webkit-scroll-snap-points-x: repeat(100%);
      scroll-snap-points-x: repeat(100%);
    }
  }
</style>
