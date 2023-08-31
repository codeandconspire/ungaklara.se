<script>
	import resolve from './utils/resolve.js';
	export let items = [];

  function scrollDown(event) {
		document.querySelector('footer').scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
    event.preventDefault()
  }
</script>

<header class="header u-container">
	<h2 class="u-hiddenVisually">Navigation</h2>
	<nav>
		<a class="logo" href="/" rel="home">Unga Klara</a>
		<ul class="list">
			{#each items as item}
				<li class="u-inlineBlock">
					<a class="link" href={resolve(item.link)}>{item.link_text}</a>
				</li>
			{/each}
			<li class="u-inlineBlock">
				<a class="link link--scroll" href="#footer" on:click={scrollDown}>
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
	</nav>
</header>

<style>
	.header {
		user-select: none;
	}

	.list {
		margin-left: -0.8rem;
	}

	.link {
		display: flex;
		align-items: center;
		padding: 0 0 0.1rem;
		border-bottom: var(--border-width) solid transparent;
		margin: 0.1em 0.3rem 0.15em 0.8rem;
		font-family: 'UK';
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		word-spacing: -0.06em;
	}

	.link:hover,
	.link.is-current:hover {
		background: black;
		color: rgb(var(--theme-color));
		border-color: transparent;
		box-shadow: 0.1em 0 0 black, -0.1em 0 0 black;
	}

	@media (min-width: 600px) {
		.link {
			margin: 0.3em 1.1rem 0.1em 0.8rem;
		}
	}

	.link.is-current {
		border-bottom-color: currentColor;
	}

	.logo {
		display: inline-block;
		padding: 0 0.2em;
		font-family: 'UK Logotype';
		font-size: 2.2rem;
		letter-spacing: -0.06em;
		line-height: 1;
		text-indent: -0.25em;
		text-transform: uppercase;
		word-spacing: -0.1em;
		margin: 1.7rem 0 0.25rem 0;
		white-space: nowrap;
	}

	.logo:hover {
		text-transform: uppercase;
	}

	@media (min-width: 450px) {
		.logo {
			margin-top: 2.3rem;
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
