<script>
  /** @type {('small'|'flexible')?} */
  export let size = null

  /** @type {'ellipse'|'rectangular'} */
  export let format = 'rectangular'
</script>

<div
  class="framed"
  class:small={size === 'small'}
  class:flexible={size === 'flexible'}
  class:ellipse={format === 'ellipse'}
  class:rectangular={format === 'rectangular'}>
  <img class="image" alt="" {...$$restProps} />
</div>

<style>
  .framed {
    flex: 0 1 auto;
    padding: 0 0 var(--distance) var(--distance);
    position: relative;
    --distance: 0.7rem;
  }

  .framed::before {
    content: '';
    width: calc(100% - var(--distance));
    height: calc(100% - var(--distance));
    position: absolute;
    left: 0;
    top: var(--distance);
    z-index: -1;
    background-color: rgb(var(--theme-color));
    border-radius: var(--border-radius);
  }

  .flexible {
    --distance: 1.4rem;
  }

  @media (min-width: 800px) {
    .framed:not(.small) {
      --distance: 1.4rem;
    }
  }

  @media (min-width: 1000px) {
    .framed:not(.small):not(.flexible):not(.ellipse) {
      --distance: 2.3rem;
    }
  }

  .image {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius);
  }

  .ellipse {
    padding: 0 0 var(--distance) var(--distance);
  }

  .ellipse .image,
  .ellipse::before {
    overflow: hidden;
    border-radius: 100%;
  }

  .ellipse::before {
    background: linear-gradient(
      -25deg,
      rgb(var(--color-pink)) 30%,
      rgba(var(--color-pink), 0) 85%,
      transparent
    );
  }
</style>
