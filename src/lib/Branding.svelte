<script>
  import { intersection } from '$lib/utils/intersection.js'
  let inview = false
</script>

<div class="branding" class:inview>
  <div class="logo" use:intersection={() => (inview = true)}>
    <i class="letter" style="animation-delay: 500ms">U</i>
    <i class="letter" style="animation-delay: 600ms">n</i>
    <i class="letter" style="animation-delay: 700ms">g</i>
    <i class="letter nudge" style="animation-delay: 800ms">a</i>
    <i class="letter space" style="animation-delay: 800ms">.</i>
    <i class="letter" style="animation-delay: 900ms">K</i>
    <i class="letter" style="animation-delay: 1000ms">l</i>
    <i class="letter" style="animation-delay: 1100ms">a</i>
    <i class="letter nudge" style="animation-delay: 1200ms">r</i>
    <i class="letter nudge" style="animation-delay: 1300ms">a</i>
  </div>
</div>

<style>
  .logo {
    font-size: 0;
    width: 100%;
    font-family: var(--logo-font-family);
    line-height: 1;
    left: -0.08em;
    text-transform: lowercase;
    word-spacing: -0.15em;
    user-select: none;
    line-height: 0.8;
  }

  .letter {
    font-size: 24vw;
    font-style: normal;
    margin-left: -0.04em;
    display: inline-block;
  }

  .inview .letter {
    animation: pop 0ms linear forwards;
  }

  .logo:hover {
    text-transform: uppercase;
  }

  .letter:first-child {
    margin-left: -0.06em;
  }

  .space {
    margin-left: -0.03em;
    color: transparent;
  }

  .nudge {
    margin-left: -0.065em;
  }

  @keyframes pop {
    from {
      text-transform: none;
    }

    to {
      text-transform: uppercase;
    }
  }

  @media (min-width: 1200px) {
    .logo {
      white-space: nowrap;
      text-align: center;
    }

    .letter:first-child {
      margin-left: -0.09em;
    }

    .letter {
      font-size: 13vw;
    }
  }

  @media (min-width: 1300px) {
    .letter {
      font-size: 13.3vw;
    }
  }

  @media (min-width: 1650px) {
    .letter {
      font-size: 14rem;
    }
  }
</style>
