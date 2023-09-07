<script>
  export let index
  export let total
  $: list = Array(total).fill(null)
</script>

<ol class="pagination">
  {#each list as _, page}
    <li class="item">
      <a
        on:click
        class="link"
        href={`?page=${page + 1}`}
        title="Gå till sida {page + 1}"
        aria-current={page + 1 === index}>
        {page + 1}
      </a>
    </li>
  {/each}
</ol>

<style>
  .pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    font-weight: bold;
    border: solid var(--border-width);
    border-radius: var(--border-radius);
    text-decoration: none;
  }

  .link[aria-current='true'] {
    color: rgb(var(--color-white));
    border-color: rgb(var(--color-black));
    background: rgb(var(--color-black));
  }
</style>
