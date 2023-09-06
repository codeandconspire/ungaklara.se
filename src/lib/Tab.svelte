<script>
  import { getContext } from 'svelte'

  import { TABLIST } from './Tablist.svelte'

  export let label
  export let key
  export let href

  $: selected = getContext(TABLIST) == key
</script>

{#if href}
  <a
    {...$$restProps}
    {href}
    role="tab"
    class="tab"
    class:selected
    data-sveltekit-noscroll>
    {label}
  </a>
{:else}
  <button {...$$restProps} role="tab" class="tab" class:selected>
    {label}
  </button>
{/if}

<style>
  .tab {
    flex: 1 1 auto;
    padding: 0.8em 0.3em;
    border: solid #000;
    border-width: 2px 0 2px 2px;
    font-size: 1em;
    text-align: center;
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    background-color: transparent;
  }

  .tab:first-child {
    border-radius: 3px 0 0 3px;
  }

  .tab:last-child {
    border-radius: 0 3px 3px 0;
    border-right-width: 2px;
  }

  @media (min-width: 600px) {
    .tab {
      font-size: 1.125em;
    }
  }

  .selected {
    background-color: #000;
    color: #fff;
  }
</style>
