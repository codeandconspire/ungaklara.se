<script>
  import Symbol from './Symbol.svelte'

  export let primary = false
  export let secondary = false
  export let disabled = false
  export let ninja = false
  export let cover = false

  /** @type {string?} */
  export let href = null

  /** @type {string?} */
  export let icon = null

  $: ({ class: _class, ...attrs } = $$restProps)
</script>

{#if href}
  <a
    {href}
    on:click
    class={`button ${_class || ''}`}
    class:primary
    class:secondary
    class:disabled
    class:ninja
    class:cover
    {...attrs}>
    {#if icon}
      <span class="icon"><Symbol name={icon} /></span>
    {/if}
    <slot />
  </a>
{:else}
  <button
    on:click
    class={`button ${_class || ''}`}
    class:primary
    class:secondary
    class:ninja
    class:cover
    {disabled}
    {...attrs}>
    {#if icon}
      <span class="icon"><Symbol name={icon} /></span>
    {/if}
    <slot />
  </button>
{/if}

<style>
  .button {
    display: inline-flex;
    align-items: center;
    padding: 0 1rem 0.2rem;
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
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    border-radius: var(--border-radius);
    height: 3rem;
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

  .button[disabled],
  .disabled {
    cursor: not-allowed;
    opacity: 0.3;
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
   * Ninja
   */

  .ninja,
  .ninja:hover,
  .ninja:active {
    color: currentColor !important;
    background-color: transparent !important;
    border: 0 !important;
    padding: 0;
    height: auto;
    text-decoration: underline;
    text-underline-offset: 0.25em;
    text-decoration-thickness: var(--border-width);
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
    margin: 0.25em 0.4em 0 -0.1em;
  }

  @media (max-width: 349px) {
    .icon {
      display: none;
    }
  }
</style>
