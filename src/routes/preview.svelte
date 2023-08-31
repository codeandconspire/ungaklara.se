<script>
	import { createClient } from '@prismicio/client';
	import resolve from '$lib/utils/resolve.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		const client = createClient('unga-klara', { fetch: window.fetch });
		const redirect = await client.resolvePreviewURL({
			defaultURL: '/',
			linkResolver: resolve
		});
		await goto(
			redirect.replace(/(?:\?(.+))?$/, function (_, query) {
				return `?${query ? query + '&' : ''}preview=true`;
			})
		);
	});
</script>

<svelte:head>
	<script
		async
		defer
		src="https://static.cdn.prismic.io/prismic.js?new=true&repo=unga-klara"
	></script>
</svelte:head>
