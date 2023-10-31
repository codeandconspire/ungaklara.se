<script context="module">
  export const TABLIST = Symbol('TABLIST')
</script>

<script>
  import { writable } from 'svelte/store'
  import { setContext } from 'svelte'

  export let selected

  const state = writable(selected)
  setContext(TABLIST, state)

  $: $state = selected
</script>

<nav class="tablist"><slot /></nav>

<style>
  .tablist {
    display: flex;
    gap: clamp(0.5rem, 1.5vw, 1.5rem);
    user-select: none;
    margin-bottom: 1.4em;
    margin-top: -1rem;
  }

  @media (min-width: 800px) {
    .tablist {
      font-size: 1.125rem;
    }
  }
</style>
