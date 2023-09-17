<script>
  export let href
</script>

<div class="show-more">
  {#if href}
    <a class="link u-textLabel" {href} {...$$restProps} on:click>
      <span class="text"><slot>Visa mer</slot></span>
    </a>
  {:else}
    <button class="link u-textLabel" {...$$restProps} on:click>
      <span class="text"><slot>Visa mer</slot></span>
    </button>
  {/if}
</div>

<style>
  .show-more {
    text-align: center;
    margin: 3rem 0 0;
    user-select: none;
  }

  .link {
    display: inline-block;
    padding: 1rem 1rem 2rem;
    margin: 1rem 0 -1rem;
    font-size: 1.125rem;
    letter-spacing: 0;
    background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%227%22%3E%3Cpath%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%20d%3D%22M5%206.5a1%201%200%200%201-.71-.29l-4-4A1.004%201.004%200%201%201%201.71.79L5%204.1%208.3.92a1%201%200%201%201%201.38%201.44l-4%203.86A1%201%200%200%201%205%206.5Z%22%2F%3E%3C%2Fsvg%3E');
    background-position: center 3rem;
    background-size: 0.625rem auto;
    background-repeat: no-repeat;
  }

  .text {
    padding: 2px 4px 3px;
    margin: -2px -4px -3px;
    border-radius: var(--border-radius);
  }

  .link:hover .text {
    background: #000;
    color: #fff;
    mix-blend-mode: darken;
  }
</style>
