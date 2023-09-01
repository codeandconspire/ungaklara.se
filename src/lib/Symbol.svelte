<script>
  export let name
</script>

{#if name === 'calendar'}
  <svg class="symbol calendar" width="25" height="25" viewBox="0 0 25 25">
    <g fill="none" fill-rule="evenodd">
      <path
        fill="currentColor"
        fill-rule="nonzero"
        d="M18.6 4h-1V3a1 1 0 1 0-2.1 0v1H9.2V3a1 1 0 1 0-2 0v1h-1A3.1 3.1 0 0 0 3 7.3v12.5c0 1.7 1.4 3.1 3.1 3.1h12.5c1.8 0 3.1-1.4 3.1-3V7.1c0-1.7-1.3-3.1-3-3.1zM6.1 6.3h1v1a1 1 0 1 0 2.2 0v-1h6.2v1a1 1 0 0 0 2 0v-1h1.1c.6 0 1 .4 1 1v4.2H5.2V7.2c0-.6.4-1 1-1zm12.5 14.6H6.1a1 1 0 0 1-1-1v-6.3h14.6v6.2c0 .6-.5 1-1 1z" />
      <circle cx="8.2" cy="16.6" r="1" fill="currentColor" />
      <path
        fill="currentColor"
        d="M16.5 15.5h-4.1a1 1 0 1 0 0 2.1h4.1a1 1 0 0 0 0-2z" />
    </g>
  </svg>
{/if}

{#if name === 'arrow'}
  <svg class="symbol arrow" width="25" height="25" viewBox="0 0 25 25">
    <g fill="none" fill-rule="evenodd">
      <path
        fill="currentColor"
        d="M6 13h11.9l-3.7 4.4a1 1 0 1 0 1.6 1.2l5-6v-.1l.1-.1.1-.4v-.4h-.1l-.1-.2-5-6a1 1 0 0 0-1.6 1.2L18 11H6a1 1 0 0 0 0 2z" />
    </g>
  </svg>
{/if}

{#if name === 'download'}
  <svg class="symbol download" width="25" height="25" viewBox="0 0 25 25">
    <g fill="none" fill-rule="evenodd">
      <path
        fill="currentColor"
        d="M19.8 14.4a1 1 0 0 0-1.4-.2L15 17V8a3 3 0 0 0-3-3H7a1 1 0 1 0 0 2h5c.6 0 1 .4 1 1v9l-3.4-2.8a1 1 0 0 0-1.2 1.6l5 4c.3.3.9.3 1.2 0l5-4c.4-.4.5-1 .2-1.4z" />
    </g>
  </svg>
{/if}

{#if name === 'clock'}
  <svg class="symbol clock" width="25" height="25" viewBox="0 0 25 25">
    <g fill="none" fill-rule="evenodd">
      <path
        fill="currentColor"
        fill-rule="nonzero"
        d="M12.333 4a8.333 8.333 0 1 0 0 16.667 8.333 8.333 0 0 0 0-16.667zm0 15a6.667 6.667 0 1 1 0-13.333 6.667 6.667 0 0 1 0 13.333z" />
      <path
        fill="currentColor"
        d="M15.667 11.5h-2.5V9A.833.833 0 0 0 11.5 9v3.333c0 .46.373.834.833.834h3.334a.833.833 0 0 0 0-1.667z" />
    </g>
  </svg>
{/if}

{#if name === 'location'}
  <svg class="symbol location" width="25" height="25" viewBox="0 0 25 25">
    <g fill="none" fill-rule="evenodd">
      <path
        fill="currentColor"
        fill-rule="nonzero"
        d="M12.67 4A6.67 6.67 0 0 0 6 10.6c0 4.57 5.88 9.65 6.13 9.87.3.26.77.26 1.08 0 .29-.22 6.12-5.3 6.12-9.87A6.67 6.67 0 0 0 12.67 4zm0 14.7c-1.4-1.32-5-5-5-8.1a5 5 0 0 1 10 0c0 3.08-3.61 6.78-5 8.1z" />
      <path
        fill="currentColor"
        fill-rule="nonzero"
        d="M12.67 7.33a2.92 2.92 0 1 0 0 5.84 2.92 2.92 0 0 0 0-5.84zm0 4.17a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
    </g>
  </svg>
{/if}

{#if name === 'checkcircle'}
  <svg class="symbol checkcircle" width="25" height="25" viewBox="0 0 25 25">
    <g fill="none" fill-rule="evenodd">
      <path
        fill="currentColor"
        fill-rule="nonzero"
        d="M13 3a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
      <path
        fill="currentColor"
        d="M15.7 9.4l-3.8 5-1.6-2.1a1 1 0 1 0-1.6 1.2l2.4 3.1a1 1 0 0 0 1.6 0l4.6-6a1 1 0 1 0-1.6-1.2z" />
    </g>
  </svg>
{/if}

{#if name === 'check'}
  <svg class="symbol check" width="25" height="25" viewBox="0 0 25 25">
    <g fill="none" fill-rule="evenodd">
      <path
        fill="currentColor"
        d="M9.9 18a1 1 0 0 1-.8-.3l-4.8-5.1a1 1 0 0 1 1.4-1.4l4.2 4.4 8.4-9.2a1 1 0 1 1 1.4 1.3l-9.1 10a1 1 0 0 1-.7.3z" />
    </g>
  </svg>
{/if}

<style>
  .symbol {
    display: inline-block;
    width: 1.45em;
    height: 1.45em;
    color: currentColor;
    position: relative;
    vertical-align: middle;
  }

  .calendar {
    top: -0.15em;
  }

  .arrow {
    top: -0.08em;
  }

  .download {
    top: -0.05em;
  }

  .clock {
    top: -0.15em;
  }

  .location {
    top: -0.17em;
  }

  .checkcircle {
    top: -0.18em;
  }
</style>
