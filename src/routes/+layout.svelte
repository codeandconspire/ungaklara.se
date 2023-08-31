<script>
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { settings: { data: settings } } = data;

	onMount(function () {
		const url = new URL(window.location);
		if (url.searchParams.get('preview')) {
			const script = document.createElement('script');
			script.async = true;
			script.defer = true;
			script.src = 'https://static.cdn.prismic.io/prismic.js?new=true&repo=unga-klara';
			document.head.appendChild(script);
		}
	});
</script>

<Header items={settings.header_menu.map((item) => item.primary)} />

<slot />

<Footer {settings} />

<style>
	@import '$lib/index.css';
</style>
