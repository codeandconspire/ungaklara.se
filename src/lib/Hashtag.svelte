<script>
  export let text = null

  const id = Math.random().toString(36).substring(2)

  let offset = 0
  let height = null
  let inview = false
  let element = null

  var onscroll = function () {
    const { scrollY } = window
    const { clientHeight } = document.documentElement
    if (scrollY > offset + height) {
      if (inview) offset = 1
      return
    }
    if (scrollY + clientHeight < offset) {
      if (inview) offset = 0
      return
    }
    const ratio = 1 - (offset + height - scrollY) / (clientHeight + height)
    offset = +ratio.toFixed(3)
    inview = true
  }

  var onresize = function () {
    height = element.offsetHeight
    offset = element.offsetTop
    var parent = element
    while ((parent = parent.offsetParent)) offset += parent.offsetTop
    onscroll()
  }
</script>

<svelte:window on:scroll={onscroll} on:resize={onresize} />

<div class="hashtag" style:--offset={offset} bind:this={element}>
  <svg class="image" width="250" height="250" viewBox="0 0 250 250">
    <g fill="none" fill-rule="nonzero">
      <path
        id="path-{id}"
        d="M125.5 216a90.5 90.5 0 1 1 0-181 90.5 90.5 0 0 1 0 181zm0-1a89.5 89.5 0 1 0 0-179 89.5 89.5 0 0 0 0 179z" />
    </g>
    <text width="250" height="250" class="text">
      <textPath alignment-baseline="top" xlink:href="#path-{id}">
        #{text}
      </textPath>
    </text>
  </svg>
</div>

<style>
  :root {
    --offset: 0;
  }

  .hashtag {
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    transform-origin: center;
    transform: translate(50%, -50%) rotate(calc(360deg * var(--offset)));
  }

  @media (max-width: 599px) {
    .hashtag {
      transform: scale(0.7) translate(50%, -50%)
        rotate(calc(360deg * var(--offset)));
    }
  }

  .image {
    transform-origin: center;
    animation: image--rotate 40s infinite linear;
  }

  @keyframes image--rotate {
    to {
      transform: rotate(360deg);
    }
  }

  .text {
    font-size: 2rem;
    font-family: var(--heading-font-family);
    line-height: var(--heading-line-height);
    font-weight: 600;
    letter-spacing: -0.025em;
  }
</style>
