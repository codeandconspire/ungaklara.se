<script context="module">
  export const TABLIST = Symbol('TABLIST')
</script>

<script>
  import { setContext } from 'svelte'

  export let selected

  $: setContext(TABLIST, selected)
</script>

<nav class="tablist"><slot /></nav>

<style>
  .tablist {
    display: flex;
    user-select: none;
    margin-bottom: 1.4em;
  }

  @media (min-width: 800px) {
    .tablist {
      font-size: 1.125rem;
    }
  }
</style>
