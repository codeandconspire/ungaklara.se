<script>
  export let background
</script>

<div class="trailer u-narrow">
  <div class="content">
    {#if background}
      <div class="background">
        <img alt="" {...background} class="image" />
      </div>
    {/if}
    <div class="u-container">
      <div class="primary">
        <slot name="primary" />
      </div>
    </div>
  </div>
  {#if $$slots.secondary}
    <div class="secondary u-container"><slot name="secondary" /></div>
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
    width: 125vw;
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
  @media (min-width: 1400px) {
    .image {
      width: 98vw;
    }
  }

  .primary {
    position: relative;
  }

  .secondary {
    margin-top: 1.5rem;
  }

  @media (min-width: 1000px) {
    .secondary {
      margin-top: 2.5rem;
    }
  }

  @media (min-width: 1200px) {
    .secondary {
      margin-top: 3.5rem;
    }
  }
</style>
