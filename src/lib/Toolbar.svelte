<script>
  import { intersection } from '$lib/utils/intersection.js'
  import Button from '$lib/Button.svelte'

  export let buttons = []

  /** @type {string?} */
  export let heading = null

  let visible = 0
  let offsetHeight
</script>

<nav
  class="toolbar"
  style:--visible={visible.toFixed(2)}
  style:--height="{offsetHeight}px"
  use:intersection={{
    onintersect(entry) {
      if (window.scrollY > entry.boundingClientRect.top) {
        visible = 1 - entry.intersectionRatio
      }
    }
  }}>
  <div class="sticky stuck" bind:offsetHeight>
    <div class="content u-container">
      {#if heading}
        <h2 class="heading">{heading}</h2>
      {/if}
      <ul class="actions">
        {#each buttons as { text, onclick, ...attrs }}
          <li class="action" class:primary={attrs.primary}>
            <Button {...attrs} on:click={onclick}>{text}</Button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>

<style>
  .toolbar {
    --visible: 0;
    --height: auto;

    height: var(--height);
    margin-bottom: calc(var(--height) * -1);
  }

  .sticky {
    position: relative;
    transform: translateY(calc(-100% * (1 - var(--visible))));
    will-change: transform;
  }

  .sticky.stuck {
    width: 100%;
    padding: 0.7em 0;
    border-bottom: 2px solid currentColor;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    background-color: rgb(var(--document-background));
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .heading {
    flex: 1 1 100%;
    font-size: 1.25rem;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  @media (min-width: 900px) {
    .heading {
      font-size: 1.5rem;
    }
  }

  .actions {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .action:not(:last-child) {
    margin-right: 1em;
  }

  @media (width <= 900px) {
    .action:not(.primary) {
      display: none;
    }
  }
</style>
