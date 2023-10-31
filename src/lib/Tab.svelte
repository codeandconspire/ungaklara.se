<script>
  import { getContext } from 'svelte'

  import { TABLIST } from './Tablist.svelte'

  export let label
  export let key
  export let href

  const state = getContext(TABLIST)

  $: selected = $state === key
</script>

{#if href}
  <a
    {...$$restProps}
    {href}
    on:click
    role="tab"
    class="tab"
    class:selected
    data-sveltekit-noscroll>
    {label}
  </a>
{:else}
  <button {...$$restProps} role="tab" class="tab" class:selected on:click>
    {label}
  </button>
{/if}

<style>
  .tab {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 0.3em;
    height: 3em;
    font-size: 1em;
    text-align: center;
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    background-color: #fff;
    border-radius: var(--border-radius);
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
