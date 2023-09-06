<script>
  export let items = []
  $: count = items.length
</script>

{#if items?.length}
  <section class="factsbox">
    <h2 class="heading">Fakta</h2>
    <dl class="list">
      {#each items as item, index}
        {@const cols = count >= 6 ? 3 : count <= 4 ? count : index < 4 ? 3 : 2}
        {@const mdCols = Math.max(2, Math.floor(cols / 2))}
        <div class={`cell u-md-size1of${mdCols} u-lg-size1of${cols}`}>
          <dt class="label">{item.label}</dt>
          <dd class="value">{item.text}</dd>
        </div>
      {/each}
    </dl>
  </section>
{/if}

<style>
  .factsbox {
    padding: 4.3rem 2.75rem 4.3rem 7rem;
    position: relative;
    background-color: rgb(var(--theme-color));
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    color: rgb(var(--theme-color-is-dark, 0, 0, 0));
  }

  @media (min-width: 600px) {
    .factsbox {
      padding: 3.3rem 1.9rem 3.5rem 8rem;
    }
  }

  @media (min-width: 1000px) {
    .factsbox {
      padding: 2.5rem 2rem 2.5rem 2rem;
    }
  }

  .heading {
    display: inline-block;
    font-size: 3.5625rem;
    position: absolute;
    left: 1.5rem;
    top: 4.25rem;
    transform-origin: 100% 0;
    transform: translateX(-100%) rotate(-90deg);
    user-select: none;
  }

  @media (min-width: 600px) {
    .heading {
      left: 2.3rem;
      top: 3.65rem;
    }
  }

  @media (min-width: 1000px) {
    .heading {
      font-size: 0;
      position: absolute;
      opacity: 0;
    }
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 0;
    margin: 0;
    font-size: 1.125rem;
  }

  @media (min-width: 1000px) {
    .list {
      text-align: center;
    }
  }

  .cell {
    flex: 1 1 100%;
    width: 100%;
    padding: 1rem;
  }

  @media (max-width: 599px) {
    .cell:first-child {
      padding-top: 0;
    }

    .cell:last-child {
      padding-bottom: 0;
    }
  }

  .label {
    display: block;
    margin: 0 0 0.3em 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.875em;
  }

  .value {
    padding: 0;
    margin: 0;
  }
</style>
