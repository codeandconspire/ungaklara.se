<script>
  /** @type {'sm'|'lg'|null} */
  export let size = null

  export let fat = false
  export let fixed = false
</script>

<div
  class={`html ${$$restProps.class}`}
  class:fat
  class:fixed
  class:small={size === 'sm'}
  class:large={size === 'lg'}>
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

  :global(.html + .html) {
    margin-top: 1.5rem;
  }

  .html :global(.muted) {
    color: rgb(var(--color-gray-dark));
  }

  .small,
  .html :global(small),
  .html :global(.small) {
    font-size: 0.875rem;
  }

  .large,
  .html :global(large) {
    font-size: 1.125rem;
  }

  .html:first-child {
    margin-top: 0;
  }

  .html:last-child {
    margin-bottom: 0;
  }

  .fat,
  .html :global(strong),
  .html :global(.fat) {
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    letter-spacing: -0.025em;
  }

  @media (min-width: 1000px) {
    .html:not(.fixed) {
      font-size: 1.125rem;
    }

    .small:not(.fixed),
    .html:not(.fixed) :global(small),
    .html:not(.fixed) :global(.small) {
      font-size: 0.875rem;
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

  .html :global(a) {
    display: inline-block;
    border-bottom: 2px solid currentColor;
    position: relative; /* 1 */
    z-index: 2; /* 1 */
    color: inherit;
    text-decoration: none;
  }

  .html :global(a:hover),
  .html :global(a:active) {
    border-color: rgb(var(--document-color));
    background: rgb(var(--document-color));
    color: rgb(255, 255, 255);
    mix-blend-mode: darken;
    box-shadow: 0.1em 0 0 black, -0.1em 0 0 black;
  }

  .html :global(.muted a:hover),
  .html :global(a.muted:hover),
  .html :global(.muted a:active),
  .html :global(a.muted:active) {
    border-color: rgb(var(--color-gray-dark));
    background: rgb(var(--color-gray-dark));
    color: rgb(255, 255, 255);
  }

  /**
   * 1. Cover all bases for strong links
   */

  .html :global(a.reset:not(:hover)) {
    border-color: transparent;
  }

  .html :global(.muted a),
  .html :global(.muted a:hover) {
    color: inherit;
    text-decoration: underline;
    font-weight: inherit;
  }

  /**
   * Block elements
   */

  .html :global(p),
  .html :global(ul),
  .html :global(ol) {
    margin: 0;
    max-width: 42em;
  }

  .html :global(p:not(:first-child)),
  .html :global(ul:not(:first-child)),
  .html :global(ol:not(:first-child)) {
    margin-top: 1em;
  }

  .html :global(p:not(:last-child)),
  .html :global(ul:not(:last-child)),
  .html :global(ol:not(:last-child)) {
    margin-bottom: 1em;
  }

  .html :global(img),
  .html :global(pre) {
    margin: 0;
  }

  .html :global(img:not(:first-child)),
  .html :global(.aspect:not(:first-child)),
  .html :global(pre:not(:first-child)),
  .html :global(figure:not(:first-child)) {
    margin-top: 1.5em;
  }

  .html :global(img:not(:last-child)),
  .html :global(.aspect:not(:last-child)),
  .html :global(pre:not(:last-child)),
  .html :global(figure:not(:last-child)) {
    margin-bottom: 1.5em;
  }

  .html :global(img + figcaption),
  .html :global(.aspect + figcaption),
  .html :global(pre + figcaption) {
    margin-top: -0.5em;
  }

  .html :global(img) {
    width: 100%;
    height: auto;
  }

  .html :global(.aspect) {
    position: relative;
    padding-bottom: var(--Text-figure-aspect);
    background: #000;
  }

  .html :global(.image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .html :global(pre) {
    font-size: 0.75em;
    overflow: auto;
    background: rgb(var(--color-gray-light));
    padding: 1em;
    text-align: left;
  }

  /**
 * Details – Summary
 */

  .html :global(details) {
    display: block;
    margin-top: 1.5em;
    border: solid;
    border-width: 0 0 var(--border-width) 0;
    cursor: default;
    outline: 0;
    position: relative;
  }

  .html :global(details:first-child),
  .html :global(details + details) {
    margin-top: 0;
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
  }

  .html :global(summary + *) {
    margin-top: 0 !important;
  }

  .html :global(summary h3) {
    border-bottom: 2px solid transparent;
    display: inline;
    padding-bottom: 0.1rem;
    margin-bottom: calc((2px + 0.1rem) * -1);
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
    background-color: currentColor;
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
    background-color: currentColor;
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

  /**
 * Blockquote
 */

  .html :global(blockquote) {
    position: relative;
    z-index: 0;
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    font-size: 1em;
    word-break: break-word;
  }

  .html :global(blockquote:not(:first-child)) {
    margin-top: 1.5rem;
  }

  .html :global(blockquote:not(:last-child)) {
    margin-bottom: 1.5rem;
  }

  .html :global(blockquote .label) {
    margin-top: 1.2rem;
  }

  @media (min-width: 600px) {
    .html :global(blockquote) {
      margin: -0.5rem 0;
      padding: 2.5rem 0 2rem 1.4em;
      font-size: 1.125em;
    }

    .html :global(blockquote::before) {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    }

    .html :global(blockquote--variant1::before) {
      width: 6rem;
      height: 6rem;
      border-radius: 100%;
      background: linear-gradient(
        53deg,
        rgb(var(--color-green)) 45%,
        rgba(var(--color-green), 0) 85%,
        transparent
      );
    }

    .html :global(blockquote--variant2::before) {
      width: 2rem;
      height: 100%;
      background: linear-gradient(
        rgba(var(--color-pink), 0) 5%,
        rgb(var(--color-pink)) 85%,
        rgb(var(--color-pink))
      );
    }

    .html :global(blockquote--variant3::before) {
      width: 4.625rem;
      height: 5rem;
      max-height: 100%;
      background-image: linear-gradient(
          rgb(var(--color-yellow)) 20%,
          rgba(var(--color-yellow), 0)
        ),
        linear-gradient(
          rgb(var(--color-yellow)) 20%,
          rgba(var(--color-yellow), 0)
        );
      background-position: 0 0, 1.9rem 0;
      background-size: 1.3rem 100%, 1.3rem 100%;
      background-repeat: no-repeat;
    }

    .html :global(blockquote--variant4) {
      padding-top: 2rem;
    }

    .html :global(blockquote--variant4::before),
    .html :global(blockquote--variant4::after) {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 5.4rem;
      height: 5.4rem;
      background-size: 100%;
      background-image: linear-gradient(
        135deg,
        rgb(var(--color-blue)) 0%,
        rgba(var(--color-blue), 0) 100%
      );
    }

    .html :global(blockquote--variant4::after) {
      width: 2.8rem;
      height: 2.8rem;
      top: 1.3rem;
      left: 1.3rem;
      background: rgb(var(--document-background));
    }
  }

  @media (min-width: 1000px) {
    .html :global(blockquote) {
      margin: -1rem 0;
    }
  }

  /**
   * Lists
   */

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
  }

  .html :global(ol > li) {
    padding-left: 0.5em;
  }

  .html :global(ul > li::before) {
    content: '–';
    position: absolute;
    left: 0;
    font-weight: 600;
    color: var(--color-theme);
  }

  .html :global(li + li) {
    margin-top: 0.8em;
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

  .html :global(dl) {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  @supports (display: grid) {
    .html :global(dl > dd) {
      padding-left: 1em;
      margin: 0;
    }

    .html :global(dl > dd:not(:last-child)) {
      margin-bottom: 0.25em;
    }
  }

  .html :global(iframe) {
    width: 100vw;
    max-width: 100%;
    vertical-align: top;
    user-select: none;
    margin-top: 1em;
  }

  /**
 * 1. Maintain 16/9 aspect ratio for embedded content (exluding Spotify)
 */

  .html :global(iframe:not([src*='spotify.com/embed'])) {
    height: calc(100% * 9 / 16); /* 1 */
  }

  /**
 * Headings
 */

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
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  .html :global(h1:not(:first-child)),
  .html :global(h2:not(:first-child)),
  .html :global(h3:not(:first-child)),
  .html :global(h4:not(:first-child)),
  .html :global(h5:not(:first-child)),
  .html :global(h6:not(:first-child)),
  .html :global(.h1:not(:first-child)),
  .html :global(.h2:not(:first-child)),
  .html :global(.h3:not(:first-child)),
  .html :global(.h4:not(:first-child)),
  .html :global(.h5:not(:first-child)),
  .html :global(.h6:not(:first-child)) {
    margin-top: 1.3rem;
  }

  .html :global(h1),
  .html :global(h2),
  .html :global(h3),
  .html :global(.h1),
  .html :global(.h2),
  .html :global(.h3) {
    margin: 0 0 -0.1rem;
    font-weight: 600;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
  }

  .html :global(h1),
  .html :global(.h1) {
    font-size: 2rem;
    margin: 0 0 1.5rem;
    line-height: 1.05;
    hyphens: auto;
  }

  @media (min-width: 500px) {
    .html :global(h1),
    .html :global(.h1) {
      font-size: 2.4rem;
      line-height: 0.95;
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
    margin-bottom: 1.3rem;
    font-weight: 600;
    font-size: inherit;
    line-height: inherit;
  }

  @media (min-width: 1200px) {
    .html :global(h1),
    .html :global(.h1) {
      font-size: 2.8rem;
    }
  }
</style>
