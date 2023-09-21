<script>
  import { srcset } from '$lib/utils/srcset'
  export let posts = []

  function image(props) {
    if (!props.url) return null
    const sources = srcset(props.url, [150, 600, 900, 1200], { aspect: 1 })
    return {
      srcset: sources,
      sizes: '30vw',
      alt: props.alt || '',
      src: sources.split(' ')[0],
      ...props.dimensions
    }
  }
</script>

<ul class="instagram">
  {#each posts as post}
    <li class="post">
      <figure>
        <a href={post.url} target="_blank" rel="noopener noreferrer">
          <img class="image" {...image(post.image)} />
        </a>
      </figure>
    </li>
  {/each}
</ul>

<style>
  .instagram {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.5rem;
  }

  .post a {
    display: block;
    aspect-ratio: 1;
    background: #fff;
  }

  .post a {
    position: relative;
    display: block;
  }

  .post a:hover::after {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: 3px solid;
  }

  .post:nth-child(n+7) {
    display: none;
  }

  .image {
    width: 100%;
    height: auto;
    transition: filter 100ms var(--ease-out);
  }

  .post a:hover .image {
    filter: brightness(1.1)
  }

  @media (min-width: 1000px) {
    .instagram {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
    }

    .post:nth-child(n) {
      display: block;
    }

    .post:nth-child(n+8) {
      display: none;
    }

    .post:nth-child(1) {
      grid-area: 1 / 6 / 3 / 4;
    }
  }
</style>
