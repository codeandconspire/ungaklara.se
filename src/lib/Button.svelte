<script>
  import Symbol from './Symbol.svelte'

  export let primary = false
  export let secondary = false
  export let cover = false
  export let href = null

  /** @type {string?} */
  export let icon = null

  $: ({ class: _class, ...attrs } = $$restProps)
</script>

{#if href}
  <a
    {href}
    class={`button ${_class || ''}`}
    class:primary
    class:secondary
    class:cover
    {...attrs}>
    {#if icon}
      <span class="icon"><Symbol name={icon} /></span>
    {/if}
    <slot />
  </a>
{:else}
  <button
    class={`button ${_class || ''}`}
    class:primary
    class:secondary
    class:cover
    {...attrs}>
    {#if icon}
      <span class="icon"><Symbol name={icon} /></span>
    {/if}
    <slot />
  </button>
{/if}

<style>
  .button {
    display: inline-block;
    display: inline-flex;
    align-items: center;
    line-height: 2.925rem;
    padding: 0 1rem;
    border: var(--border-width) solid rgb(var(--document-color));
    position: relative;
    font-size: 1rem;
    color: rgb(var(--document-color));
    background: transparent;
    font-weight: 600;
    white-space: nowrap;
    user-select: none;
    text-align: center;
    font-family: var(--heading-font-family);
  }

  .button::first-letter {
    text-transform: capitalize;
    user-select: none;
  }

  @media (min-width: 1000px) {
    .button {
      font-size: 1.125rem;
    }
  }

  .button:not([disabled]):hover {
    background: rgb(var(--document-color));
    color: #fff;
  }

  .button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /**
   * Primary button
   */

  .primary {
    background: rgb(var(--document-color));
    color: #fff;
  }

  /**
   * Secondary button
   */

  .secondary,
  .secondary:hover,
  .secondary:active {
    color: currentColor !important;
    background-color: transparent !important;
    border-color: transparent !important;
  }

  /**
   * Click cover button
   */

  .cover {
    position: static;
  }

  .cover::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  /**
   * Icons
   */

  .icon {
    display: inline-block;
    margin-right: 0.4em;
    margin-top: -0.05em;
  }

  @media (max-width: 349px) {
    .icon {
      display: none;
    }
  }
</style>
