<script>
  import { fade } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  export let items = []
  export let gap = 12
  export let minCols = 1
  export let maxCols = 3
  export let minWidth = 250
  export let maxWidth = 500
  export let animate = true
  export let duration = 200

  let height = 0
  let width = 0

  $: nCols = Math.max(
    minCols,
    Math.min(
      maxCols,
      Math.min(items.length, Math.floor(width / (minWidth + gap)) || 1)
    )
  )

  $: asCols = items.reduce(
    (cols, item, index) => {
      cols[index % cols.length].push([item, index])
      return cols
    },
    Array(nCols)
      .fill(null)
      .map(() => [])
  )
</script>

<div
  class="masonry"
  style:--gap={`${gap}px`}
  bind:clientWidth={width}
  bind:clientHeight={height}>
  {#each asCols as col}
    <div class="col" style:max-width={`${maxWidth}px`}>
      {#if animate}
        {#each col as [item, idx] (item.id)}
          <div
            in:fade={{ delay: 100, duration }}
            out:fade={{ delay: 0, duration }}
            animate:flip={{ duration }}>
            <slot {idx} {item}>
              {item}
            </slot>
          </div>
        {/each}
      {:else}
        {#each col as [item, idx] (item.id)}
          <slot {idx} {item}>
            {item}
          </slot>
        {/each}
      {/if}
    </div>
  {/each}
</div>

<style>
  .masonry {
    --gap: 12px;

    display: flex;
    gap: var(--gap);
    justify-content: center;
    overflow-wrap: anywhere;
  }

  .col {
    display: grid;
    gap: var(--gap);
    height: max-content;
    width: 100%;
  }
</style>
