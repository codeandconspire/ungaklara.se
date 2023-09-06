<script>
	import resolve from './utils/resolve.js';
	export let items = [];

  function scrollDown(event) {
		const menu = document.querySelector('#menu')
		if (!menu return)
		menu.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
    event.preventDefault()
  }
</script>

<header class="header u-container">
	<h2 class="u-hiddenVisually">Navigation</h2>
	<a class="logo" href="/" rel="home">Unga Klara</a>
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
								fill="currentColor"
								d="M6 13h11.9l-3.7 4.4a1 1 0 1 0 1.6 1.2l5-6v-.1l.1-.1.1-.4v-.4h-.1l-.1-.2-5-6a1 1 0 0 0-1.6 1.2L18 11H6a1 1 0 0 0 0 2z"
							/>
						</g>
					</svg>
				</span>
			</a>
		</li>
	</ul>
</header>

<style>
	.header {
		user-select: none;
		padding: 1.7rem 0 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem 3rem;
	}

	@media (min-width: 450px) {
		.header {
			padding: 2.25rem 0 0;
		}
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem clamp(1.25rem, 2.5vw, 2.25rem);
	}

	.link {
    display: flex;
    align-items: center;
    padding: 0 0 0.2rem;
    font-family: 'UK';
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.03em;
    word-spacing: -0.06em;
    line-height: 1.3;
		white-space: nowrap;
	}

	.link:hover {
    background: black;
    color: white;
    box-shadow: 0.3em 0 0 black, -0.3em 0 0 black;
    mix-blend-mode: color-burn;
		border-radius: var(--border-radius);
	}

	.logo {
		padding: 0 0.2em;
		font-family: 'UK Logotype';
		font-size: 2.5rem;
		letter-spacing: -0.06em;
		line-height: 1;
		text-indent: -0.25em;
		text-transform: uppercase;
		word-spacing: -0.1em;
		white-space: nowrap;
	}

	@media (min-width: 450px) {
		.logo {
			font-size: 3.3rem;
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
		color: currentColor;
	}
</style>
