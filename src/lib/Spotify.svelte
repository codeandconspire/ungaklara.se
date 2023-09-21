<script context="module">
  export const SPOTIFY_URI = /(\w+)(?:\/|:)(\w+)(?:$|\?|")/
</script>

<script>
  import Html from '$lib/Html.svelte'
  export let url

  $: parts = url.match(SPOTIFY_URI)
</script>

{#if parts}
  <div class="spotify u-paddedBox">
    <Html fat size="large">
      <slot />
      <iframe
        title="Spotify"
        src={`https://open.spotify.com/embed/${parts[1]}/${parts[2]}`}
        width="300"
        height="80"
        frameborder="0"
        allowtransparency
        allow="encrypted-media" />
    </Html>
  </div>
{/if}

<style>
  .spotify {
    position: relative;
    background-color: rgb(var(--theme-color));
    border-radius: var(--border-radius);
    overflow: hidden;
  }
</style>
