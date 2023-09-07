<script>
  export let background
</script>

<div class="trailer">
  <div class="content">
    {#if background}
      <div class="background">
        <img alt="" {...background} class="image" />
      </div>
    {/if}
    <slot name="primary" />
  </div>
  {#if $$slots.secondary}
    <div class="children"><slot name="secondary" /></div>
  {/if}
</div>

<style>
  .trailer {
    position: relative;
  }

  .content {
    position: relative;
  }

  .background {
    overflow: hidden;
  }

  .image {
    display: none;
    width: 150%;
    height: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: -1;
    transform: translate(-50%, -50%);
  }

  @media (min-width: 600px) {
    .image {
      display: block;
    }
  }

  @media (min-width: 1000px) {
    .image {
      width: 130%;
    }
  }

  @media (min-width: 1400px) {
    .image {
      width: 110%;
    }
  }

  @media (min-width: 1600px) {
    .image {
      width: 120%;
    }
  }

  @media (min-width: 2000px) {
    .image {
      width: 100%;
    }
  }

  .children {
    margin-top: 1.5rem;
  }

  @media (min-width: 1000px) {
    .children {
      margin-top: 2.5rem;
    }
  }

  @media (min-width: 1200px) {
    .children {
      margin-top: 3.5rem;
    }
  }
</style>
