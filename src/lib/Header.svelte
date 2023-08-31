<script>
	export let slices = [];
	console.log(slices);
	console.log(slices);
</script>

<header class="Header u-container">
	<h2 class="u-hiddenVisually">Navigation</h2>
	<nav>
		<a class="Header-logo" href="/" rel="home">Unga Klara</a>
		<ul class="Header-list">
			{#each slices as slice}
				<li class="u-inlineBlock">
					<a class="Header-link" href="x"> text </a>
				</li>
			{/each}
			<li class="u-inlineBlock">
				<a class="Header-link Header-link--scroll" href="#footer">
					Mer
					<span class="Header-icon">
						<svg class="Symbol Symbol--arrow" width="25" height="25" viewBox="0 0 25 25">
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
	:root {
		--scroll: 0;
		--menu-height: 3.4rem;
	}

	.Menu {
		--menu-padding-x: var(--doc-margin);

		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		padding: 0 var(--menu-padding-x);
		z-index: 4;
		height: var(--menu-height);
		background: var(--current-color-background);
		-webkit-user-select: none;
		user-select: none;
		pointer-events: none;
		color: var(--current-color);
	}

	@media print {
		.Menu {
			display: none !important;
		}
	}

	.Menu br {
		display: none;
	}

	.keeptop {
		position: absolute;
	}

	.space {
		margin-bottom: calc(var(--menu-height) * 2 + 12vh);
	}

	@media (max-width: 500px) {
		.space {
			margin-bottom: calc(var(--menu-height) * 2 + 2vh);
		}
	}

	.space.stacked {
		margin-bottom: var(--menu-height);
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.container > * {
		pointer-events: initial;
	}

	.nav {
		pointer-events: none;
	}

	.nav > * {
		pointer-events: initial;
	}

	.logo {
		display: inline-block !important;
		width: auto;
		height: 1rem;
		position: relative;
		top: 0.1rem;
		left: -0.5rem;
		padding: 0.5rem;
		box-sizing: content-box;
		-webkit-touch-callout: none;
		outline-offset: var(--focus-ring-width);
	}

	:global(.Menu .logo svg),
	:global(.Menu .logo img) {
		display: block;
		height: 100%;
		width: auto;
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	.logo,
	:global(.Menu .link),
	.toggle {
		transition: opacity 250ms var(--ease-out);
		cursor: pointer;
	}

	.logo:active,
	:global(.Menu .link:active),
	.toggle:active {
		transition: none;
		opacity: 0.6;
	}

	:global(.Menu .button) {
		display: inline-block;
		padding: 0.875rem 1.25em;
		border: 1px solid currentColor;
		font-size: 0.875rem;
		line-height: 1;
		text-align: center;
		letter-spacing: var(--doc-letter-spacing-wide);
		text-transform: uppercase;
		margin-top: 0.9rem;
		border-radius: 0.125rem;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
		outline-offset: var(--focus-ring-width);
	}

	:global(.Menu .button:hover) {
		text-decoration: none;
		background: var(--current-color);
		color: var(--current-color-background);
		border-color: var(--current-color);
	}

	:global(.Menu .button:active) {
		opacity: 0.75;
	}

	:root[scripting-enabled] {
		position: fixed;
		top: 0;
		left: 0;
	}

	.Menu::before {
		content: '';
		background: var(--current-color-background);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: var(--scroll);
		will-change: opacity;
		pointer-events: initial;
		box-shadow: 0 0 0.4rem rgb(0, 0, 0, 0.15);
	}

	.Menu.sticky::before {
		opacity: 1;
	}

	@media (min-width: 600px) {
		.Menu {
			--menu-padding-x: 1.6rem;
		}
	}

	@media (min-width: 700px) {
		.Menu::before {
			opacity: var(--scroll);
		}

		.Menu.sticky::before {
			opacity: 1;
		}
	}

	@media (min-width: 400px) {
		.logo {
			height: 1.15rem;
		}
	}

	@media (min-width: 700px) {
		:root {
			--menu-height: 3.6rem;
		}

		.logo {
			height: 1.3rem;
		}
	}

	@media (min-width: 900px) {
		:root {
			--menu-height: 4rem;
		}

		.Menu {
			--menu-padding-x: 2rem;
		}
	}

	/**
  * Narrow viewport .Menu
  */

	@media (max-width: 899px) {
		.nav {
			--current-color: var(--doc-color) !important;

			padding: 0 var(--menu-padding-x);
			color: var(--current-color);
			display: none;
			position: fixed;
			z-index: 1;
			width: 100%;
			top: 0;
			left: 0;
			pointer-events: initial;
			background: var(--current-color-background);
		}

		.desktop-only {
			display: none;
		}

		.nav-wrap {
			display: flex;
			align-items: center;
			height: var(--menu-height);
		}

		.toggle {
			display: block !important;
			position: relative;
			z-index: 2;
			width: 1.5rem;
			height: 0.625rem;
			padding: 1rem;
			box-sizing: content-box;
			list-style: none;
			outline: 0;
			margin: -1rem;
		}

		.toggle:active {
			opacity: 0.5;
		}

		.switch:focus-visible + .toggle {
			outline: dashed var(--focus-ring-width) !important;
			outline-color: var(--focus-ring-color) !important;
		}

		.line {
			position: absolute;
			top: 1rem;
			left: 1rem;
			width: 1.5rem;
		}

		.line:nth-child(2) {
			top: auto;
			bottom: 1rem;
		}

		.switch {
			display: block !important;
			position: fixed;
			top: 0;
			right: 0;
			width: 0;
			height: 0;
			opacity: 0;
		}

		.switch:checked + .toggle {
			color: var(--doc-color);
		}

		.switch:checked + .toggle .line {
			top: 48%;
			transform: rotate(45deg);
			transform-origin: center;
		}

		.switch:checked + .toggle .line:nth-child(2) {
			transform: rotate(-45deg);
			transform-origin: center;
		}

		.switch:checked ~ .nav {
			display: block;
			overflow: hidden;
			min-height: 100vh;
			box-shadow: 0 0 0 1rem var(--current-color-background);
		}

		@supports (min-height: 100dvh) {
			.switch:checked ~ .nav {
				min-height: 100dvh;
			}
		}

		.content {
			margin-top: calc(var(--menu-height) + 6vh - 0.4rem);
			position: absolute;
			top: 0;
		}

		:global(.Menu .link) {
			display: inline-block;
			font-size: 2.5rem;
			font-weight: 400;
			line-height: 1.1;
			letter-spacing: -0.025em;
			padding: 0.4rem 0;
		}

		:global(.Menu .link:hover) {
			text-decoration: underline;
			text-decoration-thickness: 1px;
			text-underline-offset: 0.11em;
		}

		:global(.Menu .active) {
			font-weight: 900;
		}
	}

	@media (min-width: 400px) and (max-width: 899px) {
		.content {
			margin-top: calc(var(--menu-height) + 11vh - 0.4rem);
		}
	}

	@media (min-width: 700px) and (max-width: 899px) {
		.content {
			margin-top: calc(var(--menu-height) + 11vh - 0.4rem);
		}
	}

	@media (min-width: 800px) and (max-width: 899px) {
		:global(.Menu .link) {
			font-size: 2.4rem;
		}
	}

	@media (max-width: 899px) and (max-height: 449px) {
		:global(.Menu .link) {
			font-size: 1.75rem;
			padding: 0.3rem 0;
		}
	}

	/**
   * Wider viewport .Menu
   */

	@media (min-width: 900px) {
		.container {
			z-index: 1;
			position: relative;
		}

		.mobile-only {
			display: none;
		}

		.content {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.list {
			display: flex;
			align-items: center;
			min-height: 2.2725rem;
		}

		.list li:last-child {
			margin-right: -0.5rem;
		}

		.list li + li {
			margin-left: 0.5rem;
		}

		:global(.Menu .link) {
			display: block;
			padding: 0.5rem 0.5rem;
			font-weight: 400;
			font-size: 0.75rem;
			line-height: 1.05;
			letter-spacing: var(--doc-letter-spacing-wide);
			text-transform: uppercase;
		}

		:global(.Menu .link:hover) {
			text-decoration: underline;
			text-decoration-color: var(--current-color);
			text-underline-offset: 0.175em;
		}

		:global(.Menu .active) {
			position: relative;
		}

		:global(.Menu .active > .link) {
			color: transparent;
		}

		:global(.Menu .active > a > span::before) {
			content: attr(data-text);
			position: absolute;
			top: 50%;
			left: 50%;
			font-weight: 900;
			color: var(--current-color);
			white-space: nowrap;
			transform: translate(-50%, -50%);
			letter-spacing: 0.03em;
		}

		.toggle,
		.switch,
		.nav .logo {
			display: none !important;
		}

		:global(.Menu .button) {
			padding: 0.7rem 0.7rem;
			font-size: 0.75rem;
			margin: 0 0 0 0.5rem;
		}
	}

	@media (min-width: 1100px) {
		:global(.Menu .link),
		:global(.Menu .button) {
			font-size: 0.875rem;
		}

		:global(.Menu .button) {
			padding: 0.75rem 1rem;
			margin: 0 0 0 0.5rem;
			position: relative;
			top: -0.5px;
		}

		.list {
			min-height: 2.5rem;
		}

		.list li + li {
			margin-left: 1rem;
		}
	}

	@media (min-width: 1100px) {
		.logo {
			height: 1.4rem;
			position: relative;
		}
	}
</style>
