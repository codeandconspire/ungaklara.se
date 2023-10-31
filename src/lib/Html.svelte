<script>
  /** @type {'small'|'large'|null} */
  export let size = null

  export let fat = false
  export let fixed = false
</script>

<div
  class={`html ${$$restProps.class || ''}`}
  class:fat
  class:fixed
  class:small={size === 'small'}
  class:large={size === 'large'}>
  <slot />
</div>

<style>
  .html {
    font-family: var(--default-font-family);
    line-height: var(--default-line-height);
    font-size: 1rem;
    width: 100%;
    max-width: 36em;
    text-align: left;
  }

  .html :global(> :first-child:not(details)) {
    margin-top: 0 !important;
  }

  .html :global(.muted) {
    color: rgb(var(--color-gray-dark));
  }

  .small,
  .html :global(small),
  .html :global(.small) {
    font-size: 1rem;
  }

  .large,
  .html :global(large) {
    font-size: 1.125rem;
  }

  .fat,
  .html :global(strong),
  .html :global(.fat) {
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
  }

  @media (min-width: 1000px) {
    .html:not(.fixed) {
      font-size: 1.125rem;
    }

    .large:not(.fixed),
    .html:not(.fixed) :global(.large) {
      font-size: 1.375rem;
    }
  }

  /**
   * Inline elements
   * 1. Sorry: make links usable when used within interactive cards (Card)
   */

  .html :global(:is(a, .link)) {
    position: relative; /* 1 */
    z-index: 2; /* 1 */
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.25em;
    text-decoration-thickness: var(--border-width);
  }

  .html :global(:is(h1, h2, .h1, .h2) :is(a, .link)) {
    text-underline-offset: 0.1em;
  }

  .html :global(:is(a, .link):hover),
  .html :global(:is(a, .link):active) {
    background: black;
    color: #fff;
    mix-blend-mode: darken;
    text-decoration: none;
    border-radius: var(--border-radius);
    padding: 0 0.15em 0.1em;
    margin: 0 -0.15em;
  }

  .html :global(.muted :is(a, .link):hover),
  .html :global(:is(a, .link).muted:hover),
  .html :global(.muted :is(a, .link):active),
  .html :global(:is(a, .link).muted:active) {
    border-color: rgb(var(--color-gray-dark));
    background: rgb(var(--color-gray-dark));
    color: rgb(255, 255, 255);
  }

  /**
   * 1. Cover all bases for strong links
   */

  .html :global(:is(a, .link).reset:not(:hover)) {
    border-color: transparent;
  }

  .html :global(.muted :is(a, .link)),
  .html :global(.muted :is(a, .link):hover) {
    color: inherit;
    text-decoration: underline;
    font-weight: inherit;
  }

  /**
   * Text blocks
   */

  .html :global(p),
  .html :global(ul),
  .html :global(ol) {
    margin-bottom: 0;
    max-width: 38em;
  }

  .html :global(p:not(:first-child)),
  .html :global(ul:not(:first-child)),
  .html :global(ol:not(:first-child)) {
    margin-top: 1em;
  }

  /* Blocks */

  .html :global(img),
  .html :global(pre) {
    margin: 0;
    border-radius: var(--border-radius);
  }

  .html :global(img),
  .html :global(.aspect),
  .html :global(pre),
  .html :global(figure) {
    margin-top: 1.5em;
  }

  .html :global(img + figcaption),
  .html :global(.aspect + figcaption),
  .html :global(pre + figcaption) {
    margin-top: 0.25em;
  }

  .html :global(img) {
    display: block;
    width: 100%;
    height: auto;
  }

  .html :global(.aspect) {
    position: relative;
    padding-bottom: calc(100% * var(--aspect) * 0.01);
    background: #000;
    overflow: hidden;
    border-radius: var(--border-radius);
  }

  .html :global(.aspect .image) {
    margin-top: 0;
    position: absolute;
    inset: 0;
  }

  .html :global(pre) {
    font-size: 0.75em;
    overflow: auto;
    background: rgb(var(--color-gray-light));
    padding: 1em;
    text-align: left;
  }

  .html :global(iframe) {
    width: 100vw;
    max-width: 100%;
    vertical-align: top;
    user-select: none;
    margin-top: 1em;
  }

  /* Details, summary */

  .html :global(details) {
    display: block;
    border: solid;
    border-width: 0 0 var(--border-width) 0;
    margin-top: calc(var(--border-width) * -1);
    cursor: default;
    outline: 0;
    position: relative;
  }

  .html :global(details:first-of-type) {
    border-top-width: var(--border-width);
  }

  .html :global(summary) {
    display: block;
    list-style: none;
    user-select: none;
    padding: 1.25rem 3rem 1.3rem 0;
    position: relative;
    outline: 0;
    font-weight: 600;
    font-size: 1.35rem;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
  }

  .html :global(summary + *) {
    margin-top: 0 !important;
  }

  .html :global(summary h1),
  .html :global(summary h2),
  .html :global(summary h3),
  .html :global(summary h4),
  .html :global(summary h5),
  .html :global(summary h6) {
    margin: 0;
  }

  .html :global(summary:active) {
    opacity: 0.5;
  }

  .html :global(summary::-webkit-details-marker) {
    display: none;
  }

  .html :global(summary::before) {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    width: 1em;
    height: 3px;
    transform: translateY(-50%);
    background-color: currentcolor;
    border-radius: 1.5px;
  }

  .html :global(summary::after) {
    content: '';
    position: absolute;
    top: 50%;
    right: 0.5em;
    width: 3px;
    height: 1em;
    transform: translate(50%, -50%);
    background-color: currentcolor;
    border-radius: 1.5px;
    transform-origin: center;
  }

  .html :global(details[open] summary::after) {
    transform: translate(50%, -50%) scaleY(0.1);
  }

  .html :global(details[open]) {
    padding-bottom: 1.4em;
  }

  @media (min-width: 800px) {
    .html :global(summary) {
      padding: 1.8rem 1rem 2rem 0;
    }

    .html :global(details[open]) {
      padding-bottom: 2.4rem;
    }
  }

  /* Lists */

  .html :global(ul) {
    list-style-type: none;
  }

  .html :global(ol) {
    list-style-type: decimal;
    padding-left: 1.5em;
  }

  .html :global(ul > li) {
    padding-left: 1.5em;
    position: relative;
    text-wrap: balance;
  }

  .html :global(ol > li) {
    padding-left: 0.5em;
    text-wrap: balance;
  }

  .html :global(ul > li::before) {
    content: '–';
    position: absolute;
    left: 0;
    font-weight: 600;
    color: var(--color-theme);
  }

  .html :global(li + li) {
    margin-top: 0.5em;
  }

  .html :global(.checklist li::before) {
    display: none;
  }

  .html :global(.checklist li) {
    padding-left: 1.8em;
    position: relative;
  }

  .html :global(.checklist li > .icon) {
    position: absolute;
    top: 0.25em;
    left: 0;
  }

  /* Maintain 16/9 aspect ratio */

  .html :global(iframe:not([src*='spotify.com/embed'])) {
    height: calc(100% * 9 / 16); /* 1 */
  }

  /* Headings */

  .html :global(h1),
  .html :global(h2),
  .html :global(h3),
  .html :global(h4),
  .html :global(h5),
  .html :global(h6),
  .html :global(.h1),
  .html :global(.h2),
  .html :global(.h3),
  .html :global(.h4),
  .html :global(.h5),
  .html :global(.h6) {
    margin: 0;
    color: rgb(var(--current-color));
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
    text-wrap: balance;
  }

  .html :global(h1),
  .html :global(h2),
  .html :global(h3),
  .html :global(h4),
  .html :global(h5),
  .html :global(h6),
  .html :global(.h1),
  .html :global(.h2),
  .html :global(.h3),
  .html :global(.h4),
  .html :global(.h5),
  .html :global(.h6) {
    margin-top: 2.5rem;
  }

  .html :global(h1),
  .html :global(h2),
  .html :global(h3),
  .html :global(.h1),
  .html :global(.h2),
  .html :global(.h3) {
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: var(--heading-letter-spacing);
    word-spacing: var(--heading-word-spacing);
  }

  .html :global(h1),
  .html :global(.h1) {
    font-size: 2rem;
    line-height: 1.05;
    hyphens: auto;
  }

  @media (min-width: 500px) {
    .html :global(h1),
    .html :global(.h1) {
      font-size: 2.4rem;
    }
  }

  .html :global(h2),
  .html :global(.h2) {
    font-size: 1.8rem;
    line-height: 1.1;
  }

  @media (min-width: 500px) {
    .html :global(h2),
    .html :global(.h2) {
      font-size: 2rem;
    }
  }

  .html :global(h3),
  .html :global(.h3) {
    font-size: 1.3rem;
    line-height: 1.1;
  }

  @media (min-width: 800px) {
    .html :global(h3),
    .html :global(.h3) {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 1000px) {
    .html :global(h3),
    .html :global(.h3) {
      font-size: 1.75rem;
      word-spacing: -0.04em;
    }
  }

  .html :global(h4),
  .html :global(h5),
  .html :global(h6),
  .html :global(.h4),
  .html :global(.h5),
  .html :global(.h6) {
    font-weight: 600;
    font-size: inherit;
    line-height: inherit;
  }

  @media (min-width: 1200px) {
    .html :global(h1),
    .html :global(.h1) {
      font-size: 2.8rem;
      margin-left: -0.05em;
    }
  }
</style>
