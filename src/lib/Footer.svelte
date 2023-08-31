<script>
	import resolve from './utils/resolve.js';
	export let settings = {};

	function addLineBreak(text) {
		return text.split('\n').reduce(function (rows, row, index, list) {
			rows.push(row, index < list.length - 1 ? '<br />' : null)
			return rows
		}, []).join('')
	}

</script>

<footer class="footer u-container">
	<div>
		<div class="cols">
			{#each settings.menu as section}
				<div class="section">
					<h3 class="title">
						<a class="link" href="${resolve(section.primary.link)}">
							{section.primary.link_text}
						</a>
					</h3>
					<ul>
						{#each section.items as item}
							<li class="item">
								<a class="link" href="{resolve(item.link)}">
									{item.link_text}
									</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			<div class="section">
				<h3 class="title">Kontakt</h3>
				<ul>
					{#if settings.phone}
						<li class="item">
							<a class="link" href="tel:{settings.phone}">{settings.phone}</a>
						</li>
					{/if}
					{#if settings.email}
						<li class="item">
							<a class="link" href="mailto:{settings.email}">{settings.email}</a>
						</li>
					{/if}
					{#if resolve(settings.contact_page)}
						<li class="item">
							<a class="link" href="{resolve(settings.contact_page)}">Personal</a>
						</li>
					{/if}
				</ul>
			</div>

			<div class="section">
				<h3 class="title">Hitta hit</h3>
				<address class="item">{@html addLineBreak(settings.address)}</address>
			</div>

			<div class="section">
				<h3 class="title">Följ oss</h3>
				<ul>
					{#each settings.platforms as item}
						<li class="item">
							<a class="link" target="_blank" href="{resolve(item.link)}">
								{item.platform}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
	<div class="u-sizeFull u-textCenter">
		<a class="logo" href="/" rel="home">
			U<span class="extra">nga </span>K<span class="extra">lara</span>
		</a>
	</div>
</footer>

<style>
	.footer {
		padding-top: 4rem;
		margin-top: -4rem;
		width: 100%;
		min-height: calc(100vh - 6rem);
		overflow: hidden;
	}

	.cols {
		display: flex;
		flex-wrap: wrap;
		margin-right: -1rem;
	}

	.section {
		flex: 0 1 50%;
		min-width: 10rem;
		margin-bottom: 2.3rem;
		padding-right: 1rem;
	}

	.title {
		margin-bottom: 0.5rem;
		font-family: 'UK';
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.item {
		padding: 0.15rem 0;
	}

	.link:hover,
	.link:active {
		outline: 0.2rem solid rgb(var(--document-color)) !important;
		background: rgb(var(--document-color));
		color: rgb(255, 255, 255);
		mix-blend-mode: darken;
	}

	.logo {
		display: inline-block;
		padding: 0 0.2em;
		margin: 1.6rem 0 3rem;
		font-family: 'UK Logotype';
		font-size: 35vw;
		letter-spacing: -0.06em;
		line-height: 1;
		text-align: center;
		text-indent: -0.13em;
		white-space: nowrap;
		text-transform: lowercase;
		word-spacing: -0.15em;
		user-select: none;
	}

	.logo:focus-visible {
		outline: 0 !important;
		text-transform: uppercase;
	}

	.logo:hover {
		text-transform: uppercase;
	}

	.extra {
		display: none;
	}

	@media (min-width: 450px) {
		.logo {
			font-size: 11vw;
		}

		.extra {
			display: inline;
		}

		.extra:first-child::after {
			content: ' ';
		}
	}

	@media (min-width: 600px) {
		.section {
			flex: 0 1 calc(100% / 3);
		}
	}

	@media (min-width: 900px) {
		.cols {
			justify-content: space-between;
			margin-right: -8rem;
		}

		.section {
			flex: 0 1 calc(100% / 4);
		}
	}

	@media (min-width: 1000px) {
		.logo {
			font-size: 8.4vw;
			margin: 4rem 0 7rem;
		}
	}

	@media (min-width: 1800px) {
		.logo {
			font-size: 7rem;
			margin: 5rem 0 10rem;
		}
	}

</style>
