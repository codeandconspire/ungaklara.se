<script>
  import { GRID } from '$lib/Grid.svelte'
  import { getContext } from 'svelte'

  const {
    ordered = false,
    carousel = false,
    size: _size = {},
    appear: _appear = false
  } = getContext(GRID)

  export let size = _size
  export let appear = _appear

  /** @type {null|string} */
  export let delay = null

  const classes = Object.entries(size)
    .map(([key, value]) =>
      key === 'xs' ? `u-size${value}` : `u-${key}-size${value}`
    )
    .concat('cell')
    .join(' ')
</script>

{#if ordered}
  <li class={classes} class:appear class:carousel style:--delay={delay}>
    <slot />
  </li>
{:else}
  <div class={classes} class:appear class:carousel style:--delay={delay}>
    <slot />
  </div>
{/if}

<style>
  /**
   * 1. Add support for truncated text within the grid
   */

  .cell {
    --delay: 0ms;

    flex: 0 0 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    min-width: 0; /* 1 */
    padding: 0 calc(var(--Grid-gutter) * 0.5);
    margin-bottom: var(--Grid-gutter);
  }

  .cell > * {
    min-width: 0; /* 1 */
  }

  .appear {
    opacity: 0;
    transform: translateY(100px);
    animation: appear 300ms var(--delay) cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }

  @keyframes appear {
    to {
      opacity: 1;
      transform: none;
    }
  }

  /**
   * Carousel
   */

  @media (max-width: 599px) {
    .carousel {
      flex-basis: calc(100% - 2rem);
      padding-left: var(--document-margin);
      padding-right: 0;
      margin-right: calc((var(--document-margin) * -1) + 1rem);
      scroll-snap-align: start;
      margin-bottom: 0;
    }
  }

  @media (max-width: 499px) {
    .carousel:last-child {
      padding-right: var(--document-margin);
      width: calc(100% + 2rem);
      flex-basis: calc(100% - 1rem);
    }
  }
</style>
