<script>
  import { page } from '$app/stores'

  import { resolve } from '$lib/prismic.js'

  export let items = []

  $: override = $page.data.page?.data.hide_intro

  function scrollDown(event) {
    const menu = document.querySelector('#menu')
    if (!menu) return
    menu.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    event.preventDefault()
  }
</script>

<div class="wrap">
  <header class="header u-container" class:override>
    <h2 class="u-hiddenVisually">Navigation</h2>
    <a class="logo" href="/" rel="home">
      <i>U</i>
      <i>n</i>
      <i>g</i>
      <i>a</i>
      <i>K</i>
      <i>l</i>
      <i>a</i>
      <i>r</i>
      <i>a</i>
    </a>
    <ul class="list">
      {#each items as item}
        <li class="u-inlineBlock">
          <a class="link" href={resolve(item.link)}>{item.link_text}</a>
        </li>
      {/each}
      <li class="u-inlineBlock">
        <a class="link link--scroll" href="#menu" on:click={scrollDown}>
          Mer
          <span class="icon">
            <svg width="25" height="25" viewBox="0 0 25 25">
              <g fill="none" fill-rule="evenodd">
                <path
                  fill="currentcolor"
                  d="M6 13h11.9l-3.7 4.4a1 1 0 1 0 1.6 1.2l5-6v-.1l.1-.1.1-.4v-.4h-.1l-.1-.2-5-6a1 1 0 0 0-1.6 1.2L18 11H6a1 1 0 0 0 0 2z" />
              </g>
            </svg>
          </span>
        </a>
      </li>
    </ul>
  </header>

  <slot />
</div>

<style>
  .header {
    --hover-background: #000;
    --hover-color: rgb(var(--theme-color));

    user-select: none;
    padding: 1.7rem 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem 3rem;
    color: var(--color);
  }

  @media (min-width: 450px) {
    .header {
      padding: 2.25rem 0 0;
    }
  }

  @media (min-width: 700px) {
    .header.override {
      --hover-background: #fff;
      --hover-color: #000;
      color: #fff;
    }

    .wrap:has(.header.override) {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      width: 100%;
    }
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem clamp(1.25rem, 2.5vw, 2.25rem);
  }

  @keyframes fade {
    from {
      transform: translateY(-2rem);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .link {
    display: flex;
    align-items: center;
    padding: 0 0 0.2rem;
    font-family: var(--heading-font-family);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
  }

  .link:hover {
    background: var(--hover-background);
    color: var(--hover-color);
    box-shadow:
      0.3em 0 0 var(--hover-background),
      -0.3em 0 0 var(--hover-background);
    border-radius: var(--border-radius);
  }

  .logo {
    font-family: var(--logo-font-family);
    font-size: 0;
    letter-spacing: -0.06em;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .logo i {
    font-size: clamp(2.5rem, 12.4vw, 11rem);
    display: inline-block;
    font-style: normal;
  }

  @keyframes drop {
    from {
      transform: translateY(-120%);
    }

    to {
      transform: translateY(0);
    }
  }

  .logo i:nth-child(1) {
    animation-delay: 100ms;
  }
  .logo i:nth-child(2) {
    animation-delay: 200ms;
  }
  .logo i:nth-child(3) {
    animation-delay: 300ms;
  }
  .logo i:nth-child(4) {
    animation-delay: 400ms;
  }
  .logo i:nth-child(5) {
    animation-delay: 500ms;
  }
  .logo i:nth-child(6) {
    animation-delay: 600ms;
  }
  .logo i:nth-child(7) {
    animation-delay: 700ms;
  }
  .logo i:nth-child(8) {
    animation-delay: 800ms;
  }
  .logo i:nth-child(9) {
    animation-delay: 900ms;
  }
  .logo i:nth-child(10) {
    animation-delay: 1000ms;
  }

  .logo i:nth-child(4) {
    margin-right: 0.5em;
  }

  @media (min-width: 500px) {
    .logo {
      margin-top: 0;
    }

    .logo i {
      font-size: 3.3rem;

      margin-right: -0.025em;
    }
  }

  .icon {
    transform: rotate(90deg) translate(-0.1em, -0.1em);
    transform-origin: center;
    position: relative;
    top: 0.2rem;
  }

  .icon svg {
    display: block;
    color: currentcolor;
  }
</style>
