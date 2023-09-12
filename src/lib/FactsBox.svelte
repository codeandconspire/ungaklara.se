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
          <dt class="u-textLabel">{item.label}</dt>
          <dd class="value">{item.text}</dd>
        </div>
      {/each}
    </dl>
  </section>
{/if}

<style>
  .factsbox {
    padding: 2.5rem 2rem 2.5rem 5.5rem;
    position: relative;
    min-height: 13.5rem;
    background-color: rgb(var(--theme-color));
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    color: rgb(var(--theme-color-is-dark, 0, 0, 0));
    border-radius: var(--border-radius);
  }

  @media (min-width: 600px) {
    .factsbox {
      padding: 2rem 2rem 2rem 7.5rem;
    }
  }

  @media (min-width: 1000px) {
    .factsbox {
      padding: 2.5rem 2rem 2.5rem 2rem;
      min-height: 0;
    }
  }

  .heading {
    display: inline-block;
    font-size: 3rem;
    position: absolute;
    left: 1rem;
    top: 2.5rem;
    transform-origin: 100% 0;
    transform: translateX(-100%) rotate(-90deg);
    user-select: none;
  }

  @media (min-width: 600px) {
    .heading {
      left: 2rem;
      top: 3rem;
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

  .value {
    padding: 0;
    margin: 0;
    font-family: var(--document-font-family);
    letter-spacing: auto;
    word-spacing: auto;
    text-wrap: balance;
  }
</style>
